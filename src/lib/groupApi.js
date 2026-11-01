import { site as fallbackSite } from '../data/site.js'
import {
  createDefaultSiteContent,
  normalizeSiteContent,
} from '../data/contentModel.js'
import { isSupabaseConfigured, supabase } from './supabase.ts'
import { createId } from './ids.ts'

const STORE_KEY = 'li-group-content-platform:demo:v1'
const PUBLIC_CACHE_KEY = 'li-group-content-platform:last-published:v1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function now() {
  return new Date().toISOString()
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private browsing can disable storage; remote content still works.
  }
}

function initialDemoStore() {
  const content = createDefaultSiteContent()
  const timestamp = now()
  return {
    draft: clone(content),
    published: clone(content),
    updatedAt: timestamp,
    publishedAt: timestamp,
    versions: [
      {
        id: createId('version'),
        note: 'Li Research Group 初始版本',
        publishedBy: 'demo@utah.edu',
        createdAt: timestamp,
        content: clone(content),
      },
    ],
    profiles: [
      {
        id: 'demo-admin',
        email: 'stuart.li@utah.edu',
        display_name: 'Yuan (Stuart) Li',
        role: 'admin',
        created_at: timestamp,
      },
      {
        id: 'demo-editor',
        email: 'student@utah.edu',
        display_name: 'Group Student',
        role: 'editor',
        created_at: timestamp,
      },
    ],
  }
}

function getDemoStore() {
  const value = readJson(STORE_KEY, null)
  if (value?.draft && value?.published) return value
  const fresh = initialDemoStore()
  writeJson(STORE_KEY, fresh)
  return fresh
}

function setDemoStore(store) {
  writeJson(STORE_KEY, store)
}

function unwrapRpcData(data) {
  return Array.isArray(data) ? data[0] : data
}

function client() {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}

function normalizeVersion(row) {
  return {
    id: String(row.id),
    note: String(row.note || 'Published version'),
    publishedBy: String(row.published_by_name || 'Group editor'),
    createdAt: String(row.created_at),
    content: normalizeSiteContent(row.content),
  }
}

export const groupApi = {
  mode: isSupabaseConfigured ? 'supabase' : 'demo',

  async getPublishedContent() {
    if (!isSupabaseConfigured) {
      return clone(getDemoStore().published)
    }

    const { data, error } = await client().rpc('get_published_content')
    if (error) {
      console.error('Unable to read published content:', error)
      return readJson(PUBLIC_CACHE_KEY, createDefaultSiteContent())
    }

    const content = normalizeSiteContent(unwrapRpcData(data) || fallbackSite)
    writeJson(PUBLIC_CACHE_KEY, content)
    return content
  },

  async signIn(email, password) {
    const { data, error } = await client().auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Unable to sign in')

    const { data: profile, error: profileError } = await client()
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('This account does not have maintenance access yet.')
    }

    return {
      id: data.user.id,
      email: data.user.email || email,
      profile,
    }
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured) return null
    const {
      data: { session },
    } = await client().auth.getSession()
    if (!session?.user) return null

    const { data: profile, error } = await client()
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error || !profile) return null
    return {
      id: session.user.id,
      email: session.user.email || '',
      profile,
    }
  },

  async signOut() {
    if (isSupabaseConfigured) await client().auth.signOut()
  },

  async getAdminContent() {
    if (!isSupabaseConfigured) {
      const store = getDemoStore()
      return {
        draft: clone(store.draft),
        published: clone(store.published),
        updatedAt: store.updatedAt,
        publishedAt: store.publishedAt,
      }
    }

    const { data, error } = await client().rpc('get_maintenance_content')
    if (error) throw new Error(error.message)
    const row = unwrapRpcData(data)
    return {
      draft: normalizeSiteContent(row?.draft),
      published: row?.published
        ? normalizeSiteContent(row.published)
        : null,
      updatedAt: row?.updatedAt || row?.updated_at || null,
      publishedAt: row?.publishedAt || row?.published_at || null,
    }
  },

  async saveDraft(content) {
    if (!isSupabaseConfigured) {
      const store = getDemoStore()
      store.draft = clone(content)
      store.updatedAt = now()
      setDemoStore(store)
      return store.updatedAt
    }

    const { data, error } = await client().rpc('save_draft', {
      p_content: content,
    })
    if (error) throw new Error(error.message)
    return String(data)
  },

  async publish(content, note, publishedBy) {
    if (!isSupabaseConfigured) {
      const store = getDemoStore()
      const timestamp = now()
      store.draft = clone(content)
      store.published = clone(content)
      store.updatedAt = timestamp
      store.publishedAt = timestamp
      store.versions.unshift({
        id: createId('version'),
        note: note.trim() || 'Published site update',
        publishedBy,
        createdAt: timestamp,
        content: clone(content),
      })
      store.versions = store.versions.slice(0, 30)
      setDemoStore(store)
      return timestamp
    }

    const { error: saveError } = await client().rpc('save_draft', {
      p_content: content,
    })
    if (saveError) throw new Error(saveError.message)

    const { data, error } = await client().rpc('publish_content', {
      p_note: note,
    })
    if (error) throw new Error(error.message)
    return String(data)
  },

  async listVersions() {
    if (!isSupabaseConfigured) {
      return clone(getDemoStore().versions)
    }
    const { data, error } = await client().rpc('list_content_versions')
    if (error) throw new Error(error.message)
    return (data || []).map(normalizeVersion)
  },

  async restoreVersion(versionId) {
    if (!isSupabaseConfigured) {
      const store = getDemoStore()
      const version = store.versions.find((item) => item.id === versionId)
      if (!version) throw new Error('Version not found')
      store.draft = clone(version.content)
      store.updatedAt = now()
      setDemoStore(store)
      return clone(store.draft)
    }

    const { data, error } = await client().rpc('restore_content_version', {
      p_version_id: versionId,
    })
    if (error) throw new Error(error.message)
    return normalizeSiteContent(data)
  },

  async listProfiles() {
    if (!isSupabaseConfigured) return clone(getDemoStore().profiles)
    const { data, error } = await client()
      .from('profiles')
      .select('*')
      .order('created_at')
    if (error) throw new Error(error.message)
    return data
  },

  async updateRole(profileId, role) {
    if (!isSupabaseConfigured) {
      const store = getDemoStore()
      store.profiles = store.profiles.map((profile) =>
        profile.id === profileId ? { ...profile, role } : profile,
      )
      setDemoStore(store)
      return
    }

    const { error } = await client().rpc('update_member_role', {
      p_profile_id: profileId,
      p_role: role,
    })
    if (error) throw new Error(error.message)
  },

  async updateDisplayName(displayName) {
    if (!isSupabaseConfigured) {
      const store = getDemoStore()
      const profile = store.profiles[0]
      store.profiles[0] = {
        ...profile,
        display_name: displayName.trim(),
      }
      setDemoStore(store)
      return displayName.trim()
    }

    const { data, error } = await client().rpc('update_my_profile', {
      p_display_name: displayName,
    })
    if (error) throw new Error(error.message)
    return String(data)
  },

  async uploadImage(file) {
    if (!isSupabaseConfigured) {
      if (file.size > 1_500_000) {
        throw new Error('Demo images must be smaller than 1.5 MB.')
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Unable to read image'))
        reader.readAsDataURL(file)
      })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${new Date().getFullYear()}/${createId('image')}-${safeName}`
    const { error } = await client().storage
      .from('site-media')
      .upload(path, file, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      })
    if (error) throw new Error(error.message)
    return client().storage.from('site-media').getPublicUrl(path).data.publicUrl
  },

  resetDemo() {
    if (!isSupabaseConfigured) setDemoStore(initialDemoStore())
  },

  getDemoUser() {
    const profile = getDemoStore().profiles[0]
    return {
      id: profile.id,
      email: profile.email,
      profile,
      demo: true,
    }
  },
}

import { useEffect, useRef, useState } from 'react'
import PersonCard from './PersonCard.jsx'
import { pickColumns } from '../utils/personColumns.js'

/**
 * 人员卡片网格：列数按容器宽度算，并避开「最后一行只落单一张」。
 * 在读成员和校友共用，所以两边的卡片大小、每行数量完全一致。
 */
export default function PersonGrid({ people }) {
  const gridRef = useRef(null)
  const [columns, setColumns] = useState(() => Math.min(people.length || 1, 4))

  useEffect(() => {
    const node = gridRef.current
    if (!node) return undefined

    const update = () => setColumns(pickColumns(people.length, node.clientWidth))
    update()

    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [people.length])

  return (
    <div className="person-grid" ref={gridRef} style={{ '--person-cols': columns }}>
      {people.map((person, index) => (
        <PersonCard key={person.key ?? person.name} person={person} delay={(index % columns) * 70} />
      ))}
    </div>
  )
}

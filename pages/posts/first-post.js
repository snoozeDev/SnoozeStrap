import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/Landing.module.scss'

export default function FirstPost() {

  let array = [...Array(5)]

  return (
    <>
      <header className={styles.header}>
        <div>{array.map(_=><p className={styles.test}>SNOOZESTRAP</p>)}</div>
        <div><h1>SNOOZESTRAP</h1></div>
        <div>{array.map(_=><p className={styles.test}>SNOOZESTRAP</p>)}</div>
      </header>
    </>
  )
}
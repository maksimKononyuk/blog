import { FC } from 'react'
import { PREV, NEXT, FIRST, LAST } from '../Constants'

type PropsType = {
  pages: number[]
  currentPage: number
  setCurrentPage: (arg: number | ((arg: number) => number)) => void
}

export const Pagination: FC<PropsType> = ({
  pages,
  currentPage,
  setCurrentPage
}) => {
  const buttonClickHandler = (page: number) => {
    setCurrentPage(page)
  }

  const prevNextFirstLastHandler = (direction: string) => {
    switch (direction) {
      case PREV:
        setCurrentPage((prev) => --prev)
        return
      case NEXT:
        setCurrentPage((prev) => ++prev)
        return
      case FIRST:
        setCurrentPage(1)
        return
      case LAST:
        setCurrentPage(pages.length)
        return
      default:
        return
    }
  }

  return (
    <div className='pagination-block'>
      <button
        onClick={() => {
          prevNextFirstLastHandler(FIRST)
        }}
        className={currentPage <= 1 ? 'pagination-block_hidden' : ''}
      >
        {'<<'}
      </button>
      <button
        onClick={() => {
          prevNextFirstLastHandler(PREV)
        }}
        className={currentPage <= 1 ? 'pagination-block_hidden' : ''}
      >
        {'<'}
      </button>
      {/* <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button className='pagination-block_active-button'>5</button> */}
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            className={
              currentPage === page ? 'pagination-block_active-button' : ''
            }
            onClick={() => buttonClickHandler(page)}
          >
            {page}
          </button>
        )
      })}
      <button
        onClick={() => {
          prevNextFirstLastHandler(NEXT)
        }}
        className={currentPage >= pages.length ? 'pagination-block_hidden' : ''}
      >
        {'>'}
      </button>
      <button
        onClick={() => {
          prevNextFirstLastHandler(LAST)
        }}
        className={currentPage >= pages.length ? 'pagination-block_hidden' : ''}
      >
        {'>>'}
      </button>
    </div>
  )
}

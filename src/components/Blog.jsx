import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      <div style={showWhenVisible}>
        {blog.url}
        <div>
          likes {blog.likes ? blog.likes : 0} <button>like</button>
        </div>
        {blog.author}
      </div>
    </div>
  )
}

export default Blog
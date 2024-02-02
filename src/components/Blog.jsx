import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, handleDeleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

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

  const updateLikes = () => {
    blogService.update(blog.id, { ...blog, likes: likes + 1 }) 
    setLikes(likes + 1)
  }

  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      <div style={showWhenVisible}>
        {blog.url}
        <div>
          likes {likes} <button onClick={updateLikes}>like</button>
        </div>
        {blog.author}
        <div>
          <button onClick={() => handleDeleteBlog(blog)}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
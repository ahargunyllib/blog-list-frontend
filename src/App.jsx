import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import usersService from './services/users'
import "./index.css";

const App = () => {
	const [notification, setNotification] = useState("");

	const [allBlogs, setAllBlogs] = useState([]);
	const [blogsId, setBlogsId] = useState([]);
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	useEffect(() => {
		const fetchAllBlogs = async () => {
			console.log('getting all blogs')
			const allBlogsRes = await blogService.getAll()
			setAllBlogs(allBlogsRes)
			console.log('res: ', allBlogsRes)
			console.log('allBlogs:', allBlogs)

			const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
			const loggedBlogUserJSON = window.localStorage.getItem("loggedBlogappBlogUser");
			if (loggedUserJSON) {
				console.log('user is logged in')
				const parsedUser = JSON.parse(loggedUserJSON);
				const parsedBlogUser = JSON.parse(loggedBlogUserJSON);
	
				setUser(parsedUser);
				console.log('user is ', parsedUser)
				setBlogsId(parsedBlogUser);
				console.log('blogsId is ', parsedBlogUser)
	
				blogService.setToken(parsedUser.token);

				let detailedUserBlogs = allBlogsRes.filter(a => parsedBlogUser.includes(a.id))
				detailedUserBlogs.sort((b1, b2) => b1.likes < b2.likes ? 1 : b1.likes > b2.likes ? -1 : 0)
				setBlogs(detailedUserBlogs);
				console.log('user blogs: ', detailedUserBlogs)
			}
		}
		fetchAllBlogs()
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		console.log("loggin in with ", username, password);

		try {
			const user = await loginService.login({ username, password });
			const userBlogs = await usersService.getBlogs(user.username);

			setUser(user);
			window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
			
			let userBlogsIds = []
			userBlogs.blogs.forEach(b => userBlogsIds.push(b.id))
			window.localStorage.setItem("loggedBlogappBlogUser", JSON.stringify(userBlogsIds));

			let detailedUserBlogs = allBlogs.filter(a => userBlogsIds.includes(a.id))
			detailedUserBlogs.sort((b1, b2) => b1.likes < b2.likes ? 1 : b1.likes > b2.likes ? -1 : 0)
			setBlogs(detailedUserBlogs);
			
			blogService.setToken(user.token);

			setUsername("");
			setPassword("");
		} catch (exception) {
			setNotification("wrong username or password");
			setTimeout(() => {
				setNotification("");
			}, 5000);
		}
	};

	const handleCreateBlog = async (event) => {
		event.preventDefault();

		try {
			await blogService.create({ title, author, url });
			const userBlogs = await usersService.getBlogs(user.username);

			let userBlogsIds = []
			userBlogs.blogs.forEach(b => userBlogsIds.push(b.id))
			window.localStorage.setItem("loggedBlogappBlogUser", JSON.stringify(userBlogsIds));
			
			let detailedUserBlogs = allBlogs.filter(a => userBlogsIds.includes(a.id))
			detailedUserBlogs.sort((b1, b2) => b1.likes < b2.likes ? 1 : b1.likes > b2.likes ? -1 : 0)
			setBlogs(() => detailedUserBlogs);

			setTitle("");
			setAuthor("");
			setUrl("");

			setNotification(`a new blog ${title} by ${author} added`);
			setTimeout(() => {
				setNotification("");
			}, 5000);
		} catch (exception) {
			setNotification("wrong crendetials");
			setTimeout(() => {
				setNotification("");
			}, 5000);
		}
	};

	const handleDeleteBlog = async (blog) => {		
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
			try {
				await blogService.remove(blog.id);
				const userBlogs = await usersService.getBlogs(user.username);
	
				let userBlogsIds = []
				userBlogs.blogs.forEach(b => userBlogsIds.push(b.id))
				window.localStorage.setItem("loggedBlogappBlogUser", JSON.stringify(userBlogsIds));
	
				let detailedUserBlogs = allBlogs.filter(a => userBlogsIds.includes(a.id))
				detailedUserBlogs.sort((b1, b2) => b1.likes < b2.likes ? 1 : b1.likes > b2.likes ? -1 : 0)
				setBlogs(() => detailedUserBlogs);
			} catch (exception) {
				setNotification("wrong crendetials");
				setTimeout(() => {
					setNotification("");
				}, 5000);
			}
		}
	}

	const loginForm = () => {
		return (
			<div>
				<h2>logging in to application</h2>
				<Notification message={notification} />
				<form onSubmit={handleLogin}>
					<div>
						username
						<input type="text" value={username} name="username" onChange={({ target }) => setUsername(target.value)}></input>
					</div>
					<div>
						password
						<input type="password" value={password} name="password" onChange={({ target }) => setPassword(target.value)}></input>
					</div>
					<button type="submit">login</button>
				</form>
			</div>
		)
	};

	const blogForm = () => {
		return (
			<form onSubmit={handleCreateBlog}>
				<div>
					title
					<input type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)}></input>
				</div>
				<div>
					author
					<input type="text" value={author} name="author" onChange={({ target }) => setAuthor(target.value)}></input>
				</div>
				<div>
					url
					<input type="text" value={url} name="url" onChange={({ target }) => setUrl(target.value)}></input>
				</div>
				<button type="submit">create</button>
			</form>
		)
	}

	return (
		<div>
			{user === null && loginForm()}
			{user !== null &&
				<div>
					<h2>blogs</h2>
					<Notification message={notification} />
					<p>
						{user.name} logged in
						<button
							type="submit"
							onClick={() => {
								setUser(null);
								window.localStorage.clear();
							}}>
							logout
						</button>
					</p>
					<h2>create new</h2>
					<Togglable buttonLabel="create new blog">
						{blogForm()}
					</Togglable>
					{blogs.map(blog => <Blog key={blog.id} blog={blog} handleDeleteBlog={handleDeleteBlog} />)}
				</div>
			}
		</div>
	);
};

export default App;
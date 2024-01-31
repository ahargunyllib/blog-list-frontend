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

	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	// useEffect(() => {
	// 	blogService.getAll().then(blogs => setBlogs(blogs));
	// }, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
		const loggedBlogUserJSON = window.localStorage.getItem("loggedBlogappBlogUser");
		if (loggedUserJSON) {
			const parsedUser = JSON.parse(loggedUserJSON);
			const parsedBlogUser = JSON.parse(loggedBlogUserJSON);
			setUser(parsedUser);
			setBlogs(parsedBlogUser.blogs);
			blogService.setToken(parsedUser.token);
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		console.log("loggin in with ", username, password);

		try {
			const user = await loginService.login({ username, password });
			const userBlogs = await usersService.getBlogs(user.username);

			window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
			window.localStorage.setItem("loggedBlogappBlogUser", JSON.stringify(userBlogs));
			blogService.setToken(user.token);
			setUser(user);
			setBlogs(userBlogs.blogs);

			setUsername("");
			setPassword("");
		} catch (exception) {
			setNotification("wrong username or password");
			setTimeout(() => {
				setNotification("");
			}, 5000);
		}
	};

	const handleCreateForm = async (event) => {
		event.preventDefault();
		console.log("creating blog with ", title, author, url);

		try {
			await blogService.create({ title, author, url });
			const userBlogs = await usersService.getBlogs(user.username);
			window.localStorage.setItem("loggedBlogappBlogUser", JSON.stringify(userBlogs));
			setBlogs(userBlogs.blogs);

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

	const noteForm = () => {
		return (
			<form onSubmit={handleCreateForm}>
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
					<Togglable buttonLabel="new blog">
						{noteForm()}
					</Togglable>
					{blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
				</div>
			}
		</div>
	);
};

export default App;
I want to port out an existing personal website (~/Projects/personal/iantumulak-website). It is originally built in React. Here are the goals for this project:

1. **Port into Astro**: The main goal is to migrate the existing React codebase into an Astro project. 
2. **Maintain Functionality**: Ensure that all existing template, features, and functionalities of the website are preserved during the migration process.
3. **Optimize Performance**: Take advantage of Astro's performance benefits, such as partial hydration and server-side rendering, to improve the website's load times and overall performance.
4. **Responsive Design**: Ensure that the website remains fully responsive and works well on various devices and screen sizes.
5. **SEO Optimization**: Implement best practices for SEO to improve the website's visibility in search engine results.
6. **Blog Integration**: I want to integrate a blog. All articles should be written in Markdown and no database should be 
used. The blog should be easily manageable and allow for easy addition of new posts.
  - Add a new blog section in home page with a list of recent articles.
  - Add a new blog page that lists all articles with pagination.
  - Add a single article page that displays the full content of a selected article.
7. **Integrate Disqus**: Set up Disqus for comments on blog posts, allowing visitors to engage with the content and leave feedback.
8. **Deploy to Github.io**: Set up the project for deployment on GitHub Pages, ensuring that the deployment process is smooth and automated.

Other Requirements:
- Drop Sanity and instead use Markdown files for blog content.
- Copy over an existing docker-compose.yml from ~/Projects/personal/personal-web-astro and utilize the proxy setup for local development. Use the domain `iantumulak.localhost`.
- Create the Astro in the `app` folder
- Create a Dockerfile in the `app` folder
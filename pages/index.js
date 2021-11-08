import Link from "next/link";
import { getAllPosts } from "../utils/mdx";

export default function BlogList({ posts }) {
  return (
    <div className="wrapper">
      <p>Recently Published</p>
      <div>
        {posts.map((post, index) => {
          const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
          }
          const date = new Date(post.frontmatter.publishedOn).toLocaleString(undefined, options)
          return (
            <article className="ContentPreview" key={index}>
              <Link href={`posts/${post.slug}`} passHref={true}>
                <a>
                  <h3>{post.frontmatter.title}</h3>
                  <p>{post.frontmatter.abstract}</p>
                  <div>
                    <p>Read More</p>
                    <p>{date}</p>
                  </div>
                </a>
              </Link>
              <br></br>
            </article>
          )
        })}
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const posts = getAllPosts();
  // sort array - https://stackoverflow.com/a/67992215/6908282
  posts.sort((a, b) => a.frontmatter.publishedOn > b.frontmatter.publishedOn ? -1 : 1)

  return {
    props: { posts },
  };
};
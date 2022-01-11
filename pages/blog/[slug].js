import { useMemo } from "react";
import Link from "next/link";
import { getMDXComponent } from "mdx-bundler/client";
import { getAllPosts, getSinglePost } from "../../utils/mdx";

const CustomLink = (props) => {
    // reference: https://github.com/vercel/next.js/discussions/11110#discussioncomment-6744
    // reference: https://github.com/leerob/leerob.io/blob/main/components/MDXComponents.tsx

    const href = props.href;
    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

    if (isInternalLink) {
        return (
            <Link href={encodeURIComponent(href)}>
                <a {...props} className={`${props.className || ""} internalLink`}>{props.children}</a>
            </Link>
        );
    }

    return <a target="_blank" rel="noopener noreferrer" className={`${props.className || ""}`} {...props} />;
};

const Post = ({ code, frontmatter }) => {
    const Component = useMemo(() => getMDXComponent(code), [code]);
    return (
        <div className="content">
            <h1>{frontmatter.title}</h1>
            <main>
                <Component
                    components={{
                        a: CustomLink,
                    }}
                />
            </main>
        </div>
    );
};

export const getStaticProps = async ({ params }) => {
    const post = await getSinglePost(params.slug);
    return {
        props: { ...post },
    };
};

export const getStaticPaths = async () => {
    const paths = getAllPosts().map(({ slug }) => ({ params: { slug } }));
    return {
        paths,
        fallback: false,
    };
};

export default Post;
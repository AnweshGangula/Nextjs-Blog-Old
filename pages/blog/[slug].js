import { useMemo } from "react";
import Link from "next/link";
import { getMDXComponent } from "mdx-bundler/client";
import { getAllPosts, getSinglePost } from "../../utils/mdx";
import styled from 'styled-components'

const InternalLink = styled.a`
    display: inline-block;
    color: lightseagreen;
`

const RehypeAutoLink = styled.a`
    opacity: 0;
    position: absolute;
    margin-left: -1em;
    padding-right: 0.5em;
    width: 80%;
    max-width: 700px;
    cursor: pointer;

    &:before{
        content: "#";
    }

    &:hover {
    opacity: 0.75;
    text-decoration: none;
    }

`

const CustomLink = (props) => {
    // reference: https://github.com/vercel/next.js/discussions/11110#discussioncomment-6744
    // reference: https://github.com/leerob/leerob.io/blob/main/components/MDXComponents.tsx

    const href = props.href;
    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));
    const rehypeAutoLink = props.className && props.className == "rehypeautolinkheadings";

    if (rehypeAutoLink) {
        return (
            <Link href={href} passHref>
                {/* TODO: make below anchor tag into a styled component */}
                <RehypeAutoLink {...props} className={`${props.className || ""}`}>{props.children}</RehypeAutoLink>
            </Link>);
    }
    else if (isInternalLink) {
        return (
            // href={encodeURIComponent(href)}
            <Link href={href} passHref>
                {/* TODO: make below anchor tag into a styled component */}
                <InternalLink {...props} className={`${props.className || ""}`}>{props.children}</InternalLink>
            </Link>
        );
    }
    else {
        return (
            // TODO: make below anchor tag into a styled component
            <a {...props} target="_blank" rel="noopener noreferrer" className={`${props.className || ""}`} />
        );
    }
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
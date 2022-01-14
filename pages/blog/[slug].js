import { useMemo } from "react";
import Link from "next/link";
import { getMDXComponent } from "mdx-bundler/client";
import { getAllPosts, getSinglePost } from "../../utils/mdx";

import styles from '../../styles/[slug].module.css'

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
                <a {...props} className={`${styles.rehypeautolinkheadings} ${props.className || ""}`}>{props.children}</a>
            </Link>);
    }
    else if (isInternalLink) {
        return (
            // href={encodeURIComponent(href)}
            <Link href={href}>
                <a {...props} className={`${props.className || ""} ${styles.internalLink}`}>{props.children}</a>
            </Link>
        );
    }

    return <a target="_blank" rel="noopener noreferrer" className={`${props.className || ""}`} {...props} />;
};

const Post = ({ code, frontmatter }) => {
    const Component = useMemo(() => getMDXComponent(code), [code]);
    return (
        <div className="content">
            <svg style={{ display: "none" }}>
                {/*  https://primer.style/octicons/link-16 */}
                {/* https://github.com/janosh/svelte-toc/commit/8493df334a11661eddf03434372f6cd71ea313c1#diff-d7f304dd518dddaa8bf2027b9d4e3a9fc11a3c9b18cf39085bfa162d0076acd3 */}
                <symbol id="link-icon" fill="currentColor">
                    <path
                        d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0z"
                    />
                </symbol>
            </svg>
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
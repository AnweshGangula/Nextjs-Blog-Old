import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

import remarkGfm from 'remark-gfm'
import { remarkMdxImages } from 'remark-mdx-images';
import rehypeToc from '@jsdevtools/rehype-toc'
import rehypeSlug from 'rehype-slug';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import { s } from 'hastscript'

export const POSTS_PATH = path.join(process.cwd(), "data/posts");

export const getSourceOfFile = (fileName) => {
    return fs.readFileSync(path.join(POSTS_PATH, fileName));
};

export const getAllPosts = () => {
    return fs
        .readdirSync(POSTS_PATH)
        .filter((path) => /\.mdx?$/.test(path))
        .map((fileName) => {
            const source = getSourceOfFile(fileName);
            const slug = fileName.replace(/\.mdx?$/, "");
            const { data } = matter(source);

            return {
                frontmatter: data,
                slug: slug,
            };
        });
};

export const getSinglePost = async (slug) => {
    const source = getSourceOfFile(slug + ".mdx");

    const { code, frontmatter } = await bundleMDX(source, {
        cwd: POSTS_PATH,
        xdmOptions(options) {
            options.remarkPlugins = [
                ...(options.remarkPlugins ?? []),
                remarkGfm,
                remarkMdxImages,
                // remarkMath,
            ];
            options.rehypePlugins = [
                ...(options.rehypePlugins ?? []),
                [rehypeToc,
                    {
                        headings: ["h2", "h3"],     // Only include <h1> and <h2> headings in the TOC
                        cssClasses: {
                            toc: "page-outline",      // Change the CSS class for the TOC
                            link: "page-link",        // Change the CSS class for links in the TOC
                        }
                    }
                ],
                rehypeSlug,
                rehypeCodeTitles,
                rehypePrism,
                [rehypeAutolinkHeadings,
                    {
                        behavior: 'prepend',
                        content: s(
                            // add SVG using rehype-autolink-headings in mdx.js - https://github.com/remarkjs/remark/discussions/732#discussioncomment-816042
                            // another reference: https://github.com/janosh/svelte-toc/commit/8493df334a11661eddf03434372f6cd71ea313c1
                            `svg`,
                            { width: 16, height: 16, viewBox: `0 0 16 16` },
                            // symbol #link-icon defined in app.html
                            s(`use`, { 'xlink:href': `#link-icon` })
                        ),
                        properties: {
                            ariaHidden: true,
                            tabIndex: -1,
                            className: ['rehypeautolinkheadings'], // TODO: this is not working with CSS Module imports (since module imports rename classes)
                        },
                        test: [`h1`, `h2`, `h3`, `h4`, `h5`, `h6`] // Customizable headings: https://github.com/rehypejs/rehype-autolink-headings/issues/11

                    }
                ]
            ];

            return options;
        },
        esbuildOptions: (options) => {
            options.outdir = `../../public/img/${slug}`;
            options.loader = {
                ...options.loader,
                '.jpg': 'file',
            };
            options.publicPath = `img/${slug}`;
            options.write = true;

            return options;
        },
    });

    return {
        frontmatter,
        code,
    };
};

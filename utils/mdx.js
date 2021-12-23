import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

import rehypePrism from 'rehype-prism-plus';

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
            options.rehypePlugins = [
                ...(options.rehypePlugins ?? []),
                // if I remove this plugins it builds without any issue
                rehypePrism,
            ];

            return options;
        },
    });

    return {
        frontmatter,
        code,
    };
};

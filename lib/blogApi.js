import axios from "axios";

export const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/blog/`;

// 検索
export const blogGet = (url) => axios.get(url).then((res) => res.data);
// PKで検索
export const blogGetPk = (url) => axios.get(url).then((res) => res.data);

// ------------------------------------
// ブログデータの全件取得
// ------------------------------------
export const getSortedPostsData = async () => {
  const blogs = await blogGet(apiUrl);
  const filteredBlogs = blogs.sort(function (a, b) {
    if (a.created_at < b.created_at) return 1;
    if (a.created_at > b.created_at) return -1;
    return 0;
  });
  return filteredBlogs;
};

// ------------------------------------
// ブログデータの全件取得（idのみ）
// ------------------------------------
export const getAllPostIds = async () => {
  const blogs = await blogGet(apiUrl);
  return blogs.map((blog) => {
    return {
      params: {
        id: String(blog.id),
      },
    };
  });
};

// ------------------------------------
// ブログデータの取得（パラメータのキーで取得する）
// ------------------------------------
export const getPostData = async (id) => {
  if (!id) return null;
  const blog = await blogGetPk(`${apiUrl}${id}/`);
  return blog;
};

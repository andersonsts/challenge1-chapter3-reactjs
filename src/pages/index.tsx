import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import Link from 'next/link';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { getPrismicClient } from '../services/prismic';
// import { ptBR } from 'date-fns/locale';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;

  const [posts, setPosts] = useState<Post[]>(results);
  const [page, setPage] = useState({ current: 1, total: 1 });

  const setTotalPage = useCallback(async () => {
    if (!next_page) return;
    const response = await fetch(next_page);
    const data = await response.json();
    setPage(prev => ({ ...prev, total: data.page }));
  }, [next_page]);

  const handleMorePosts = async (): Promise<void> => {
    const response = await fetch(next_page);
    const data = await response.json();

    if (page.current === data.page) return;

    setPage(prev => ({
      ...prev,
      current: prev.current + 1,
    }));

    const morePosts = data.results.map(result => ({
      uid: result.uid,
      first_publication_date: format(
        new Date(result.first_publication_date),
        'd LLL uuuu'
      ),
      data: {
        title: result.data.title,
        subtitle: result.data.subtitle,
        author: result.data.author,
      },
    }));

    setPosts(prev => [...prev, ...morePosts]);
  };

  useEffect(() => {
    setTotalPage();
  }, [setTotalPage]);

  return (
    <>
      <Header />

      <main className={styles.main}>
        <ul className={commonStyles.postList}>
          {posts.map(post => (
            <li key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <strong>{post.data.title}</strong>
                </a>
              </Link>

              <p>{post.data.subtitle}</p>
              <div className={styles.postItemFooter}>
                <div>
                  <AiOutlineCalendar />
                  <span>{post.first_publication_date}</span>
                </div>
                <div>
                  <AiOutlineUser />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </li>
          ))}

          {page.current < page.total && (
            <button
              type="button"
              className={styles.loadMorePosts}
              onClick={handleMorePosts}
            >
              Carregar mais posts
            </button>
          )}
        </ul>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: [
        'post.uid',
        'post.first_publication_date',
        'post.title',
        'post.subtitle',
        'post.author',
        'post.content',
        'post.data',
      ],
      pageSize: 1,
    }
  );

  const results = response.results.map(result => ({
    uid: result.uid,
    first_publication_date: format(
      new Date(result.first_publication_date),
      'd LLL uuuu'
    ),
    data: {
      title: result.data.title,
      subtitle: result.data.subtitle,
      author: result.data.author,
    },
  }));

  const { next_page } = response;

  const postsPagination = {
    next_page,
    results,
  };

  return {
    props: {
      postsPagination,
    },
  };
};

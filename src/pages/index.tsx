import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { useEffect } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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
  // useEffect(() => console.log('data', postsPagination), [postsPagination]);
  return <h1>ok</h1>;
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
      pageSize: 40,
    }
  );

  const results = response.results.map(result => ({
    uid: result.uid,
    first_publication_date: result.first_publication_date,
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

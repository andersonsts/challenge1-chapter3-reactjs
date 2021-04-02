import { GetStaticPaths, GetStaticProps } from 'next';
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineUser,
} from 'react-icons/ai';
import { format } from 'date-fns';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Header />

      <img src={post.data.banner.url} alt="banner img" className={styles.img} />

      <main className={styles.main}>
        <div>
          <h1>{post.data.title}</h1>
          <div className={styles.postItemFooter}>
            <div>
              <AiOutlineCalendar />
              <span>{post.first_publication_date}</span>
            </div>
            <div>
              <AiOutlineUser />
              <span>{post.data.author}</span>
            </div>
            <div>
              <AiOutlineClockCircle />
              <span>4 min</span>
            </div>
          </div>
        </div>

        <ul className={commonStyles.postList}>
          {post.data.content.map(contentItem => (
            <li key={contentItem.heading}>
              <strong>{contentItem.heading}</strong>
              {contentItem.body.map(bodyItem => (
                <p key={bodyItem.text}>{bodyItem.text}</p>
              ))}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'd LLL uuuu'
      // { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(contentItem => ({
        heading: contentItem.heading,
        body: contentItem.body.map(bodyItem => ({
          text: bodyItem.text,
        })),
      })),
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30,
  };
};

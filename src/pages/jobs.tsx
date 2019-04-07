import * as React from 'react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-server-express';

import { MainLayout } from '../layouts/main-layout';
import { NewsFeedView } from '../components/news-feed';
import { NewsFeed } from '../components/news-feed';
import { withData } from '../helpers/with-data';

const POSTS_PER_PAGE = 30;

const query = gql`
  query topNewsItems($type: FeedType!, $first: Int!, $skip: Int!) {
    feed(type: $type, first: $first, skip: $skip) {
      ...NewsFeed
    }
  }
  ${NewsFeedView.fragments.newsItem}
`;

export interface IJobsPageProps extends IJobsPageOwnProps {}

export interface IJobsPageOwnProps {
  options: {
    first: number;
    skip: number;
  };
}

const JobNewsFeed = graphql<IJobsPageOwnProps>(query, {
  options: ({ options: { first, skip } }) => ({
    variables: {
      type: 'JOB',
      first,
      skip,
    },
  }),
  props: ({ data }) => ({
    data,
  }),
  // loadMorePosts: data =>
  //   data.fetchMore({
  //     variables: {
  //       skip: data.allNewsItems.length,
  //     },
  //     updateQuery: (previousResult, { fetchMoreResult }) => {
  //       if (!fetchMoreResult) {
  //         return previousResult;
  //       }
  //       return Object.assign({}, previousResult, {
  //         // Append the new posts results to the old one
  //         allNewsItems: [...previousResult.allNewsItems, ...fetchMoreResult.allNewsItems],
  //       });
  //     },
  //   }),
})(NewsFeed);

export const JobsPage = withData(props => {
  const pageNumber = (props.url.query && +props.url.query.p) || 0;

  const notice = [
    <tr key="noticetopspacer" style={{ height: '20px' }} />,
    <tr key="notice">
      <td />
      <td>
        <img alt="" src="/static/s.gif" height="1" width="14" />
      </td>
      <td>
        These are jobs at startups that were funded by Y Combinator. You can also get a job at a YC startup through{' '}
        <a href="https://triplebyte.com/?ref=yc_jobs">
          <u>Triplebyte</u>
        </a>
        .
      </td>
    </tr>,
    <tr key="noticebottomspacer" style={{ height: '20px' }} />,
  ];

  return (
    <MainLayout currentUrl={props.url.pathname}>
      <JobNewsFeed
        options={{
          currentUrl: props.url.pathname,
          first: POSTS_PER_PAGE,
          isRankVisible: false,
          isUpvoteVisible: false,
          isJobListing: true,
          skip: POSTS_PER_PAGE * pageNumber,
          notice,
        }}
      />
    </MainLayout>
  );
});

export default JobsPage;
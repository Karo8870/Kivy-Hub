import nextra from 'nextra';

const withNextra = nextra({
  search: {
    codeblocks: false
  },
  latex: true
});

export default withNextra({
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/user-manual',
        permanent: false
      }
    ];
  }
});

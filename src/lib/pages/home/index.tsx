'use client';

import { Flex } from '@chakra-ui/react';

import PlaylistGeneratorCard from '~/lib/layout/PlaylistGeneratorCard';

const Home = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Flex w="sm">
        <PlaylistGeneratorCard />
      </Flex>
    </Flex>
  );
};

export default Home;

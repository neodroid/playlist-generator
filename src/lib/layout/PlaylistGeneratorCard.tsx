/* eslint-disable no-console */
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import 'react-input-range/lib/css/index.css';
import InputRange from 'react-input-range';

const PlaylistGeneratorCard = () => {
  const [artist, setArtist] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState<string>('');
  const [popularity, setPopularity] = useState({ min: 0, max: 100 });
  const toast = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generatePlaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artist,
          minPopularity: popularity.min,
          maxPopularity: popularity.max,
          playlistName,
        }),
      });

      const data = await response.json();
      if (data.playlistUrl) {
        window.open(data.playlistUrl, '_blank');
        setLoading(false);
      } else if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error generating playlist:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while generating the playlist.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="70vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
      w="full"
    >
      <Stack
        spacing={4}
        w="full"
        maxW="md"
        bg={useColorModeValue('white', 'gray.700')}
        rounded="xl"
        boxShadow="lg"
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Create Your Playlist
        </Heading>
        <FormControl id="artist" isRequired>
          <FormLabel>Artist</FormLabel>
          <Input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Taylor Swift"
            _placeholder={{ color: useColorModeValue('gray.500', 'gray.300') }}
            type="text"
          />
        </FormControl>
        <FormControl id="popularityRange">
          <FormLabel>Popularity Range</FormLabel>
          <Box>
            <Box my="10">
              <InputRange
                minValue={0}
                maxValue={100}
                value={popularity}
                onChange={(value) => {
                  if (typeof value !== 'number') {
                    setPopularity(value);
                  }
                }}
              />
            </Box>
            <Text mt={2}>
              Range: {popularity.min} - {popularity.max}
            </Text>
          </Box>
        </FormControl>
        <FormControl id="playlistName" isRequired>
          <FormLabel>Playlist Name</FormLabel>
          <Input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="e.g. My Pop Hits"
            _placeholder={{ color: useColorModeValue('gray.500', 'gray.300') }}
            type="text"
          />
        </FormControl>
        <Button
          isLoading={loading}
          onClick={handleSubmit}
          bg={useColorModeValue('blue.400', 'blue.300')}
          color="white"
          w="full"
          _hover={{
            bg: useColorModeValue('blue.500', 'blue.400'),
          }}
        >
          Generate Playlist
        </Button>
      </Stack>
    </Flex>
  );
};

export default PlaylistGeneratorCard;

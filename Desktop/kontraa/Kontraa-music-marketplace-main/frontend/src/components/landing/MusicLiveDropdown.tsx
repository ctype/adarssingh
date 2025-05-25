import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Image,
  Flex,
  Input,
  List,
  ListItem,
  useDisclosure,
} from '@chakra-ui/react';
import { useDebounce } from 'use-debounce';
import { fetchAudios } from '@/features/audio/audioSlice';

const MusicLiveSearch = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const baseFilter = { limit: 10, offset: 0 };

  // Select from Redux store
  const { audios = [], isLoading } = useAppSelector((state) => state.audios);

  // Memoize search param string to avoid unnecessary reruns
  const searchParamString = useMemo(() => searchParams.get('search') || '', [searchParams]);

  // Fetch audios action
  const getAudios = useCallback(
    async (filter) => {
      try {
        await dispatch(
          fetchAudios({
            filter: {
              ...filter,
              status: 1,
              isDraft: false,
            },
          })
        ).unwrap();
      } catch (error) {
        console.error('Failed to fetch audios', error);
      }
    },
    [dispatch]
  );

  // Sync search param to state on mount or param change
  useEffect(() => {
    setSearchQuery(searchParamString);
    if (searchParamString) {
      onOpen();
    } else {
      onClose();
    }
  }, [searchParamString, onOpen, onClose]);

  // Update URL & fetch audios on debounced input change
  useEffect(() => {
    const val = debouncedQuery.trim();

    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('search', val);
      onOpen();
    } else {
      params.delete('search');
      onClose();
    }

    // Update URL without creating new history entries
    navigate(`${pathname}?${params.toString()}`, { replace: true });

    getAudios({ ...baseFilter, search: val || null });
  }, [debouncedQuery, getAudios, navigate, pathname, searchParams, onOpen, onClose]);

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const transformResults = (data) =>
    data.map((item) => ({
      id: item.id,
      title: item.title,
      artist: item.artistName || 'Unknown Artist',
      image: item.coverImage || '/default-music.png',
      type: item.type || 'song',
      duration: formatDuration(item.duration),
      year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : undefined,
    }));

  const results = transformResults(audios);

  const clearSearch = () => {
    setSearchQuery('');
    onClose();
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'song':
        return '🎵';
      case 'album':
        return '💿';
      case 'playlist':
        return '📋';
      case 'artist':
        return '🎤';
      default:
        return '🎶';
    }
  };

  return (
    <Box width="100%" maxW="600px" mx="auto" position="relative" mt={4}>
      <Input
        type="text"
        placeholder="Search songs, artists, albums..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (e.target.value) onOpen();
          else onClose();
        }}
        borderRadius="md"
        bg="whiteAlpha.100"
        _hover={{ bg: 'whiteAlpha.200' }}
        _focus={{ bg: 'whiteAlpha.200', boxShadow: 'outline' }}
        color="white"
        fontSize="md"
        px={4}
        py={2}
        onFocus={onOpen}
      />

      {searchQuery && (
        <Box
          position="absolute"
          right={3}
          top={3}
          cursor="pointer"
          onClick={clearSearch}
          color="gray.400"
          fontWeight="bold"
          userSelect="none"
        >
          ×
        </Box>
      )}

      {isOpen && (
        <Box
          position="absolute"
          width="100%"
          mt={2}
          bg="gray.800"
          borderRadius="md"
          boxShadow="lg"
          zIndex="dropdown"
          maxH="60vh"
          overflowY="auto"
          py={2}
        >
          {isLoading ? (
            <Box p={4} textAlign="center">
              <Text color="gray.400">Searching...</Text>
            </Box>
          ) : results.length ? (
            <List spacing={2}>
              {results.map((item) => (
                <ListItem
                  key={item.id}
                  px={4}
                  py={2}
                  _hover={{ bg: 'gray.700' }}
                  cursor="pointer"
                  onClick={() => {
                    console.log('Selected:', item);
                    onClose();
                  }}
                >
                  <Flex align="center">
                    <Box mr={3} fontSize="xl">
                      {getIconForType(item.type)}
                    </Box>
                    <Image
                      src={item.image}
                      alt={item.title}
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius={item.type === 'artist' ? 'full' : 'md'}
                      mr={3}
                    />
                    <Box flex="1">
                      <Text fontWeight="bold" noOfLines={1}>
                        {item.title}
                      </Text>
                      <Text fontSize="sm" color="gray.400" noOfLines={1}>
                        {item.artist}
                        {item.type === 'song' && item.duration && ` • ${item.duration}`}
                        {item.year && ` • ${item.year}`}
                      </Text>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box p={4} textAlign="center">
              <Text color="gray.400">{searchQuery ? 'No results found' : 'Start typing to search'}</Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MusicLiveSearch;

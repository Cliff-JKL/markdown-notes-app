import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import * as React from 'react';
import { Note } from 'shared/api';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { generateItemKey } from 'shared/lib';
import { observer } from 'mobx-react-lite';
import { useStores } from 'app/root-store-context';

export const SideListMenu = observer(() => {
  const { notes, auth, tags } = useStores();

  const [search, setSearch] = React.useState('');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [filterByTag, setFilterByTag] = React.useState('');
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1000);

  const listItemRef = React.useRef<HTMLDivElement | null>(null);
  const tagsListItemRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    notes.getNotesAction();
    tags.getTagsAction();
  }, [auth.isAuthorized()]);

  React.useEffect(() => {
    listItemRef?.current?.scrollIntoView({
      behavior: 'instant',
      block: 'nearest',
    });
  }, [notes.activeNoteIndex]);

  // React.useEffect(() => {
  //   tagsListItemRef?.current?.scrollIntoView({
  //     behavior: 'instant',
  //     block: 'nearest',
  //   });
  // }, [activeTagIndex]);

  const handleTagsListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    tagName: string,
  ) => {
    setActiveTagIndex(index);
    setFilterByTag(tagName);
    notes.setFilteredNotes(search, tagName);
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    note: Note,
  ) => {
    notes.setActiveNote(note);
  };

  const handleCreateClick = () => {
    notes.createEmptyNoteAction();
  };

  const filteredNotes = (input: string) => {
    if (!input && !filterByTag) {
      return notes.notes;
    }

    if (!input) {
      return notes.notes.filter((note) =>
        note.tags.some((tag) => tag.name === filterByTag),
      );
    }

    const filter = input.toLowerCase();
    return notes.notes.filter((el) => {
      return (
        el.title.toLowerCase().includes(filter) ||
        el.text.toLowerCase().includes(filter) ||
        el.tags.some((tag) => tag.name.toLowerCase().includes(filter))
      );
    });
  };

  const handleSearchUpdate = (input: string) => {
    setSearch(input);
    notes.setFilteredNotes(input, filterByTag);
  };

  const handleCollapse = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Box
        // elevation={8}
        // square={true}
        sx={{
          height: '100%',
          width: '100%',
          maxWidth: 240,
          // p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            p: 2,
          }}
        >
          {/* <IconButton aria-label="newItem" onClick={handleCreateClick}>
            <NoteAddOutlinedIcon />
          </IconButton> */}
          <TextField
            // label="Search"
            // variant="standard"
            size="small"
            value={search}
            onChange={(event) => handleSearchUpdate(event.target.value)}
            margin="normal"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            placeholder="Search"
          />
          {/* <SearchIcon /> */}
        </Stack>
        <Divider flexItem />
        <Box
          sx={{ width: '100%', maxWidth: 360, height: '200px', flexGrow: 1 }}
        >
          <List
            component="nav"
            aria-label="notes list"
            disablePadding
            sx={{
              // bgcolor: 'background.paper',
              width: '100%',
              overflow: 'auto',
              scrollbarWidth: 'none',
              scrollbarColor: 'transparent transparent',
              // maxHeight: '750px',
              height: '100%',
            }}
          >
            <ListItem dense disablePadding key="test_collapsed_list">
              <ListItemButton
                onClick={(event) => handleCollapse(event)}
                // ref={listItemRef}
              >
                <ListItemText primary="PRESS TO EXPAND" />
              </ListItemButton>
            </ListItem>
            <Collapse in={isCollapsed}>
              <List
                component="ul"
                aria-label="testtt"
                disablePadding
                sx={{
                  // bgcolor: 'background.paper',
                  width: '100%',
                  overflow: 'auto',
                  scrollbarWidth: 'none',
                  scrollbarColor: 'transparent transparent',
                  // maxHeight: '750px',
                  height: '100%',
                }}
              >
                <ListItemText primary="Note1" />
                <ListItemText primary="Note2" />
                <ListItemText primary="Note3" />
                <ListItemText primary="Note4" />
                <ListItemText primary="Note5" />
              </List>
            </Collapse>
            <ListItem
              dense
              disablePadding
              key={generateItemKey('all', '-1000')}
            >
              <ListItemButton
                selected={activeTagIndex === -1000}
                onClick={(event) => handleTagsListItemClick(event, -1000, '')}
                ref={activeTagIndex === -1000 ? tagsListItemRef : null}
              >
                <ListItemText primary="All" />
                <ListItemText primary={notes.notesCount} />
              </ListItemButton>
            </ListItem>
            {tags.tags.map((item, index) => (
              <ListItem
                dense
                disablePadding
                key={generateItemKey(item.name, item.id)}
              >
                <ListItemButton
                  selected={index === activeTagIndex}
                  onClick={(event) =>
                    handleTagsListItemClick(event, index, item.name)
                  }
                  ref={index === activeTagIndex ? tagsListItemRef : null}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box
        // elevation={8}
        // square={true}
        sx={{
          height: '100%',
          width: '100%',
          maxWidth: 240,
          // p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            p: 2,
          }}
        >
          <IconButton aria-label="newItem" onClick={handleCreateClick}>
            <NoteAddOutlinedIcon />
          </IconButton>
        </Stack>
        <Divider flexItem />
        <Box
          sx={{ width: '100%', maxWidth: 360, height: '200px', flexGrow: 1 }}
        >
          <List
            component="nav"
            aria-label="notes list"
            disablePadding
            sx={{
              // bgcolor: 'background.paper',
              width: '100%',
              overflow: 'auto',
              scrollbarWidth: 'none',
              scrollbarColor: 'transparent transparent',
              // maxHeight: '750px',
              height: '100%',
            }}
          >
            {notes.filteredNotes.map((item, index) => (
              <ListItem
                dense
                disablePadding
                key={generateItemKey(item.title, item.id)}
              >
                <ListItemButton
                  selected={index === notes.activeNoteIndex}
                  onClick={(event) => handleListItemClick(event, index, item)}
                  ref={index === notes.activeNoteIndex ? listItemRef : null}
                >
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
});

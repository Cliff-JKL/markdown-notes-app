import * as React from 'react';
import { Box, Chip, Divider, IconButton, Paper, Stack } from '@mui/material';
import { useStores } from 'app/root-store-context';
import { AddTagsButton } from 'features/add-tags-button';
import { observer } from 'mobx-react-lite';
import { debounce, generateItemKey } from 'shared/lib';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { MarkdownEditor } from 'widgets/markdown-editor';
import { type Tag, UpdateNote } from 'shared/api';

export const NoteEditor = observer(() => {
  const { notes } = useStores();
  // const bgColor = 'white';
  const bgColor = 'paper';

  const handleDeleteClick = (event: React.MouseEvent<unknown>, id: string) => {
    notes.deleteNoteAction(id);
  };

  const formatTitle = (value: string) => {
    return value.substring(value.indexOf('# ') + 2, value.indexOf('\n'));
  };

  const debouncedUpdate = React.useCallback(
    debounce(
      (id: string, nextValue: UpdateNote) =>
        notes.updateNoteAction(id, nextValue),
      1000,
    ),
    [],
  );

  const updateText = (value: string) => {
    const updateData: UpdateNote = {
      text: value,
      fields: { title: formatTitle(value) },
      lastUpdated: new Date().toISOString(),
    };

    notes.updateActiveNoteAction(updateData);
    debouncedUpdate(notes.activeNote.id, updateData);
  };

  const updateTags = (tags: Tag[]) => {
    const tagsIds = tags.map((t) => t.id);
    const updatedData: UpdateNote = {
      fields: { tags: tagsIds },
      lastUpdated: new Date().toISOString(),
    };

    notes.updateNoteAction(notes.activeNote.id, updatedData);
  };

  const sortedTags = () => {
    return notes.activeNote ? notes.activeNote.tags : [];
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        bgcolor: bgColor,
        height: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
          p: 2,
          // bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            width: '75%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <AddTagsButton
            tags={notes.activeNote ? notes.activeNote.tags : []}
            updateTags={updateTags}
          />
          {sortedTags().map((item) => (
            <Chip
              key={generateItemKey(item.name, item.id)}
              label={item.name}
              color="primary"
              size="small"
              sx={{ m: '0 8px' }}
            />
          ))}
        </Box>
        <Box>
          <IconButton
            aria-label="deleteNote"
            onClick={(event) => handleDeleteClick(event, notes.activeNote.id)}
          >
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </Box>
      </Stack>
      <Divider flexItem />
      <Box
        // elevation={8}
        // square={true}
        sx={{
          width: '100%',
          marginTop: 2,
          p: 2,
          display: 'flex',
          height: '200px',
          flexGrow: 1,
        }}
      >
        <div
          className="editor"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MarkdownEditor
            content={notes.activeNote ? notes.activeNote.text : ''}
            onChange={updateText}
            height={700}
          />
        </div>
      </Box>
    </Box>
  );
});

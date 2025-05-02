import { Divider } from '@mui/material';
import { SideListMenu } from 'widgets/side-list-menu';
import { NoteEditor } from 'widgets/note-editor';

export const NotesPage = () => {
  return (
    <div
      className="note-page"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        // bgcolor: 'background.paper',
      }}
      // sx={{
      //   display: 'flex',
      //   flexDirection: 'row',
      //   alignItems: 'flex-start',
      //   // bgcolor: 'background.paper',
      // }}
    >
      <SideListMenu />
      <Divider orientation="vertical" flexItem />
      <NoteEditor />
    </div>
  );
};

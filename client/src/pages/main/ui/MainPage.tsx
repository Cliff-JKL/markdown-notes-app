import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

export const MainPage = observer(() => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      p={4}
    ></Box>
  );
});

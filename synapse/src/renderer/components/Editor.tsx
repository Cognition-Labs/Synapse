import { Box } from '@chakra-ui/layout';
import { Textarea } from '@chakra-ui/textarea';
import { useRecoilState } from 'recoil';
import { editorState } from 'renderer/atoms';

export const Editor: React.FC = () => {
  const [value, setValue] = useRecoilState(editorState);
  return (
    <Box m={3} p={3}>
      <Textarea
        width={'100%'}
        height={'100%'}
        rowGap={5}
        rows={30}
        m={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></Textarea>
    </Box>
  );
};

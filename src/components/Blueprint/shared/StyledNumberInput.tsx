import {
    NumberInputProps,
    Unstable_NumberInput,
} from '@mui/base/Unstable_NumberInput';
import {TextField, IconButton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function StyledNumberInput(props: NumberInputProps) {
    return (
        <Unstable_NumberInput
            slots={{
                input: TextField,
                incrementButton: IconButton,
                decrementButton: IconButton,
            }}
            slotProps={{
                root: {
                    style: {display: 'flex'},
                },
                input: {
                    style: {width: '70px'},
                },
                incrementButton: {
                    children: <AddIcon />,
                    style: {order: '1'},
                },
                decrementButton: {
                    children: <RemoveIcon />,
                },
            }}
            {...props}
        />
    );
}

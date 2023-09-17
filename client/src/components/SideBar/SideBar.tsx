import { IconButton } from '@mui/material';
import styles from './SideBar.module.scss'
import classnames from 'classnames';
import SaveIcon from '@mui/icons-material/Save';
import ClassIcon from '@mui/icons-material/Class';
import CreateIcon from '@mui/icons-material/Create';

export type Props = {
    className?: string;
    noteId: string;
    saveClick: any;
}

function SideBar({className, noteId, saveClick}: Props) {
    return (
        <div className={classnames(styles.SideBar, className)}>
            <IconButton onClick={saveClick} className={styles.icon}>
                <SaveIcon/>
            </IconButton>
            <IconButton className={styles.icon}>
                <ClassIcon/>
            </IconButton>
            <IconButton className={styles.icon}>
                <CreateIcon/>
            </IconButton>
            <IconButton className={styles.icon}>
                <SaveIcon/>
            </IconButton>

        </div>
    )
}

export default SideBar;

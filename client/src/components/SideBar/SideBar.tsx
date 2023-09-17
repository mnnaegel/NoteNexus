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
    linkView: any;
    editorView: any;

}

function SideBar({className, noteId, saveClick, linkView, editorView}: Props) {
    return (
        <div className={classnames(styles.SideBar, className)}>
            <IconButton onClick={saveClick} className={styles.icon}>
                <SaveIcon/>
            </IconButton>
            <IconButton className={styles.icon} onClick={linkView}>
                <ClassIcon />
            </IconButton>
            <IconButton className={styles.icon} onClick={editorView}>
                <CreateIcon/>
            </IconButton>

        </div>
    )
}

export default SideBar;

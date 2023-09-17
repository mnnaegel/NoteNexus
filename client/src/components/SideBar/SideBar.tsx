import styles from './SideBar.module.scss'
import classnames from 'classnames';

export type Props = {
    className?: string;
    noteId: string;
}

function SideBar({className, noteId}: Props) {
    return (
        <div className={classnames(styles.SideBar, className)}>

        </div>
    )
}

export default SideBar;

const FileTree = ({ files }) => {
    return (
        <ul>
            {files.map(file => (
                <li key={file.id}>
                    {file.name}
                    {file.children && <FileTree files={file.children} />}
                </li>
            ))}
        </ul>
    );
}
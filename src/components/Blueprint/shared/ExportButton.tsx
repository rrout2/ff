import {Button} from '@mui/material';
import {toPng} from 'html-to-image';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

// TODO: cleanup/refactor
export default function ExportButton(props: {
    className: string | string[];
    label?: string;
    pngName?: string;
    zipName?: string;
}) {
    const {className, pngName, zipName, label} = props;
    let onclick: () => void;
    if (typeof className === 'string') {
        onclick = () =>
            toPng(
                document.getElementsByClassName(className)[0] as HTMLElement,
                {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    cacheBust: true,
                }
            )
                .then(dataUrl => {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = pngName || 'default_name.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(console.error);
    } else {
        onclick = () => {
            const zip = new JSZip();
            const dataUrlPromises = className.map(cn => {
                return toPng(
                    document.getElementsByClassName(cn)[0] as HTMLElement,
                    {
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        cacheBust: true,
                    }
                );
            });
            Promise.all(dataUrlPromises)
                .then(dataUrls => {
                    dataUrls.forEach((dataUrl, idx) => {
                        const content = dataUrl.substring(
                            dataUrl.indexOf('base64,') + 'base64,'.length
                        );
                        zip.file(`${className[idx]}.png`, content, {
                            base64: true,
                        });
                    });
                    zip.generateAsync({type: 'blob'})
                        .then(blob => {
                            saveAs(blob, zipName || 'blueprint-components');
                        })
                        .catch(console.error);
                })
                .catch(console.error);
        };
    }
    return (
        <Button
            variant="outlined"
            onClick={onclick}
            style={{
                margin: '8px',
                width: '120px',
            }}
        >
            {label || (pngName ? 'Export As PNG' : 'Download Blueprint')}
        </Button>
    );
}

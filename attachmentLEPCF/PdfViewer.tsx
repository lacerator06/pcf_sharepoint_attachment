import * as React from "react";
import { uploadPdfs, loadPdfs } from "./services/sharepointService";
import { IInputs } from "./generated/ManifestTypes";
import { SharePointFile } from "./types";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

interface Props {
    context: ComponentFramework.Context<IInputs>;
}

export const PdfViewer: React.FC<Props> = ({ context }) => {

    const [files, setFiles] = React.useState<SharePointFile[]>([]);
    const [index, setIndex] = React.useState(0);

    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useEffect(() => {
        refresh();
    }, []);

    const refresh = async () => {
        const pdfs = await loadPdfs(context);
        setFiles(pdfs);
        setIndex(0);
    };

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        await uploadPdfs(context, e.target.files);
        await refresh();
    };

    const currentFile = files[index];

    return (
        <div className="pdf-root">

            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
            >
                Upload files
                <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={onUpload}
                    style={{
                        display: "none"
                    }}
                />
            </Button>

            {currentFile && (
                <div className="carousel">

                    <button
                        disabled={index === 0}
                        onClick={() => setIndex(i => i - 1)}
                    >
                        ◀
                    </button>

                    <iframe
                        ref={iframeRef}
                        src={currentFile.ServerRelativeUrl}
                        className="pdf-frame"
                    />

                    <button
                        disabled={index === files.length - 1}
                        onClick={() => setIndex(i => i + 1)}
                    >
                        ▶
                    </button>

                </div>
            )}

            <div className="counter">
                {files.length > 0 && `${index + 1} / ${files.length}`}
            </div>

        </div>
    );
};

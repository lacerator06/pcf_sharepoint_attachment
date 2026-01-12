import { Box, Button } from "@mui/material";
import * as React from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function FileUpload(props: { onChange: () => void; placeholder: string; }) {
    return (
        <Box height={"100%"}>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                style={
                    {
                        width: "200px"
                    }
                }
            >
                Upload files
                <input
                    type="file"
                    onChange={(event) => console.log(event.target.files)}
                    multiple
                    accept="application/pdf"
                />
            </Button>

            <iframe height="600" width="100%" src="google.com">

            </iframe>
        </Box>

    )
}


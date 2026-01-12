import * as React from "react";

export default function Button(props: { label: string; onClick: () => void }) {
    return <button onClick={props.onClick}>{props.label}</button>;
}
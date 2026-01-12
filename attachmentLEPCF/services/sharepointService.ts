import { SharePointFile, SharePointFilesResponse, DocumentLocation } from "../types";
import { IInputs } from "../generated/ManifestTypes";

export async function loadPdfs(
    context: ComponentFramework.Context<IInputs>
): Promise<SharePointFile[]> {

     const recordId = context.parameters.recordId.raw!;
      if (!recordId) return [];

    const location = await getLocation(context, recordId);
    const siteUrl = await getSiteUrl(context, location);

    const res = await fetch(
        `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${location.relativeurl}')/Files`,
        { headers: { Accept: "application/json;odata=verbose" } }
    );

    const json = (await res.json()) as SharePointFilesResponse;

    return json.d.results.filter(
        f => f.Name.toLowerCase().endsWith(".pdf")
    );
}

export async function uploadPdfs(
    context: ComponentFramework.Context<IInputs>,
    files: FileList
): Promise<void> {

    const recordId = context.parameters.recordId.raw!;
    const location = await getLocation(context, recordId);
    const siteUrl = await getSiteUrl(context, location);

    for (const file of Array.from(files)) {

        if (file.type !== "application/pdf") continue;

        const uploadUrl =
            `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${location.relativeurl}')` +
            `/Files/add(url='${file.name}',overwrite=true)`;

        await fetch(uploadUrl, {
            method: "POST",
            headers: { Accept: "application/json;odata=verbose" },
            body: file
        });
    }
}
async function getLocation(
    context: ComponentFramework.Context<IInputs>,
    recordId: string
): Promise<DocumentLocation> {

    const result =
        await context.webAPI.retrieveMultipleRecords(
            "sharepointdocumentlocation",
            `?$select=relativeurl,parentsiteorlocation_sharepointsite
       &$filter=_regardingobjectid_value eq ${recordId}`
        );

    const entity = result.entities[0] as unknown as DocumentLocation;

    return entity;
}


async function getSiteUrl(
    context: ComponentFramework.Context<IInputs>,
    location: DocumentLocation
): Promise<string> {

    const site = await context.webAPI.retrieveRecord(
        "sharepointsite",
        location.parentsiteorlocation_sharepointsite,
        "?$select=absoluteurl"
    );

    return site.absoluteurl as string;
}



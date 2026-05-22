import "./Screenshots.css";

import Neutralino from "@neutralinojs/lib";
import { useEffect, useState } from "preact/hooks";
import { useManager } from "../utils/ManagerProvider.jsx";

import Button from "../components/Button.jsx";

import deleteIcon from "../assets/buttons/delete.svg";
import closeIcon from "../assets/buttons/close.svg";
import folderIcon from "../assets/buttons/folder.svg";
import screenshotIcon from "../assets/buttons/screenshot.svg";

export default function ScreenshotMenu({ setMenu }) {
    const Manager = useManager();
    const [images, setImages] = useState([]);
    const [expanded, setExpanded] = useState(null);

    const loadScreenshots = async () => {
        const instanceList = await Manager.instances.list();
        const screenshotList = await Promise.all(
            instanceList.map(async (instanceID) => {
                const screenshots = await Manager.instances.getScreenshots(instanceID);
                const inst = await Manager.instances.get(instanceID);

                return Promise.all(
                    screenshots.map(async (screenshot) => {
                        const binaryContent = await Neutralino.filesystem.readBinaryFile(screenshot.path);
                        const byteArr = new Uint8Array(binaryContent);

                        let base64Str = "";
                        byteArr.forEach((byte) => {
                            base64Str += String.fromCharCode(byte);
                        });

                        const dataURI = `data:image/png;base64,${btoa(base64Str)}`;

                        return {
                            ...screenshot,
                            instance: inst,
                            dataURI,
                        };
                    })
                );
            })
        );

        setImages(screenshotList.flat());
    };

    useEffect(() => {
        loadScreenshots();
    }, []);

    return (
        expanded !== null ? (
            <>
                <div id="top-bar">
                    <h1>Screenshot</h1>
                    <div id="main-actions">
                        <Button tooltip="Open Screenshot in Default App" tooltipAlign="RIGHT" onclick={() => Manager.instances.openScreenshot(expanded.path)}>
                            <img src={screenshotIcon} draggable={false} />
                        </Button>
                        <Button tooltip="Open Screenshots Folder" tooltipAlign="RIGHT" onclick={() => Manager.instances.openScreenshotsFolder(expanded.path)}>
                            <img src={folderIcon} draggable={false} />
                        </Button>
                        <Button tooltip="Delete Screenshot" tooltipAlign="RIGHT" onclick={async() => {
                            const res = await Manager.instances.deleteScreenshot(expanded.name, expanded.path);
                            if (res === true) {
                                setExpanded(null);
                                loadScreenshots();
                            };
                        }}>
                            <img src={deleteIcon} />
                        </Button>
                        <Button tooltip="Close" tooltipAlign="RIGHT" onclick={() => setExpanded(null)}>
                            <img src={closeIcon} />
                        </Button>
                    </div>
                </div>

                <div id="screenshot" className="expanded" onclick={() => Manager.instances.openScreenshot(expanded.path)}>
                    <div className="screenshot-date">{expanded.dateAndTime}</div>
                    <img className="screenshot-instance" src={expanded.instance.icon} />
                    <img className="screenshot-preview" src={expanded.dataURI} alt={expanded.name} />
                    <div className="screenshot-filename">{expanded.name}</div>
                </div>
            </>
        ) : (
            <>
                <div id="top-bar">
                    <h1>Screenshots</h1>
                    <div id="main-actions">
                        <Button onclick={() => setMenu('main')}>
                            <img src={closeIcon} />
                        </Button>
                    </div>
                </div>

                {images.length === 0 ? (
                    <div id="screenshots-empty">No screenshots found. Press F2 in-game.</div>
                ) : (
                    <div id="screenshots">
                        {images.map(img => (
                            <div key={img.name} id="screenshot" onclick={() => setExpanded(img)}>
                                <div className="screenshot-date">{img.date}</div>
                                <img className="screenshot-instance" src={img.instance.icon} />
                                <img className="screenshot-preview" src={img.dataURI} alt={img.name} />
                                <div className="screenshot-filename">{img.name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        )
    );
};

export const VideoLoopComponent = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video
                autoPlay
                loop
                muted
                style={{ height: '100vh', width: 'auto', transform: 'rotate(270deg)' }}
            >
                <source
                    src="https://www.sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4"
                    type="video/mp4"
                />
                Tu navegador no admite la reproducción de videos en HTML5.
            </video>
        </div>
    );
};

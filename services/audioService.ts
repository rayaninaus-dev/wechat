
// Audio Service abstraction to handle playback across Web and Mini Program contexts.

// In Web: Uses AudioContext + decodeAudioData (or manual PCM decoding)
// In Mini Program: Uses wx.createInnerAudioContext() + FileSystemManager to write temp files.

export const playAudioData = async (base64Audio: string) => {
    if (!base64Audio) return;
    
    // Web Implementation
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Convert raw PCM 16-bit to AudioBuffer
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
    } catch (e) {
        console.error("Audio playback error", e);
    }

    // --- WeChat Mini Program Implementation Hint ---
    /*
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/temp_audio.pcm`; // or wav header addition needed
    // Note: InnerAudioContext doesn't play raw PCM directly easily. 
    // You typically need to add a WAV header or use a specific PCM player plugin if available.
    // Or, simpler: Ask Gemini for MP3 format if possible (Modality.AUDIO usually returns PCM though).
    // For now, in Mini Program, one might upload the PCM to a server to convert to MP3, or add WAV header on client.
    */
}

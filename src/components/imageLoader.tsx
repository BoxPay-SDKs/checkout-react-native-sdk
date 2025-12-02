import { useState, useEffect } from "react";
import { SvgXml } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { Image, type ImageSourcePropType , View} from "react-native";

interface ImageLoaderProps {
    image : string,
    errorImage : ImageSourcePropType
}

const ImageLoader = ({image , errorImage} : ImageLoaderProps) => {
    const [error, setImageError] = useState(false);
    const [load, setLoad] = useState(true);
    const [extractedImage, setExtractedImage] = useState("");
    const [svgContent, setSvgContent] = useState("");

    useEffect(() => {
        if (image != "") {
          fetch(image)
          .then((response) => response.text())
          .then((text) => {
            // 1. CHECK FOR HIDDEN PNGs (Like the Visa logo)
            const base64Match = text.match(/xlink:href="(data:image\/[^"]+)"/);
    
            if (base64Match && base64Match[1]) {
              setExtractedImage(base64Match[1]);
            } else {
              // 2. CHECK FOR MISSING VIEWBOX (Fixes the cropping issue)
              let finalSvg = text;
              
              if (!finalSvg.includes('viewBox')) {
                // Try to find width and height to create a viewBox
                const widthMatch = text.match(/width="([^"]+)"/);
                const heightMatch = text.match(/height="([^"]+)"/);
    
                if (widthMatch && widthMatch[1] && heightMatch && heightMatch[1]) {
                  const w = parseFloat(widthMatch[1]);
                  const h = parseFloat(heightMatch[1]);
                  
                  // Inject the viewBox into the <svg> tag
                  // We replace "<svg " with "<svg viewBox="0 0 w h" "
                  finalSvg = finalSvg.replace(
                    '<svg ',
                    `<svg viewBox="0 0 ${w} ${h}" `
                  );
                }
              }
    
              setSvgContent(finalSvg);
            }
            setLoad(false);
          })
          .catch((err) => {
            console.error("SVG Load Error:", err);
            setImageError(true);
            setLoad(false);
          });
        }
    }, [image]);

    return (
        <View
          style={{
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {load && !error && (
            <ShimmerPlaceHolder
              visible={false} // Keep shimmer until loading is done
              style={{ width: 32, height: 32, borderRadius: 8 }}
            />
          )}
          {(!error && !load) && (
            <>
            {extractedImage && (
            <Image
              source={{ uri: extractedImage }}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain', // Keeps the aspect ratio correct inside the square
              }}
            />
          )}
          {svgContent && !extractedImage && (
            <SvgXml
              xml={svgContent}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet" // Keeps vectors sharp and centered
            />
          )}
            </>
          )}
          {error && (
            <Image
            source={errorImage}
            style={{ transform: [{ scale: 0.4 }] }}
          />
          )}
        </View>
    )
}

export default ImageLoader
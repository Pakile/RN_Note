import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text } from 'react-native';
import TextSize from 'react-native-text-size';
const AutoSizedText = () => {
  const maxWidth = 200;
  const maxHeight = 400;
  const text = 'HELLO ';

  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const adjustFontSize = async () => {
      const { width, height } = Dimensions.get('window');

      if (width > maxWidth || height > maxHeight) {
        const { width: textWidth, height: textHeight } = await TextSize.measure(
          {
            text,
            width: maxWidth,
            fontSize
          }
        );

        const scaleFactor = Math.min(
          maxWidth / textWidth,
          maxHeight / textHeight
        );
        const newFontSize = Math.min(16, fontSize * scaleFactor);

        setFontSize(newFontSize);
      }
    };

    adjustFontSize();
  }, [maxWidth, maxHeight, text, fontSize]);

  return (
    <View style={{ maxWidth, maxHeight }}>
      <Text style={{ fontSize }}>{text}</Text>
    </View>
  );
};
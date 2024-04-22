import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroAnimations,
} from "@viro-community/react-viro";
import { Asset } from 'expo-asset';

const InitialScene = () => {
  const [rotation, setRotation] = useState([-45, 50, 40]);
  const [position, setPosition] = useState([0, 0, -5]);
  const [skullScale, setSkullScale] = useState([0.02, 0.02, 0.02]); // Adjusted scale

  ViroAnimations.registerAnimations({
    rotate: {
      duration: 2500,
      properties: {
        rotateY: "+=90",
      },
    },
  });

  const moveObject = (newPosition) => {
    setPosition(newPosition);
  }

  const rotateObject = (rotateState, rotationFactor, source) => {
    if (rotateState === 3) {
      let newRotation = [rotation[0] - rotationFactor,rotation[1] - rotationFactor,rotation[2] - rotationFactor]
      setRotation(newRotation);
      console.log(rotationFactor);
    } 
  };
  
  const scaleSkullObject = (pinchState, scaleFactor, source) => {
    if (pinchState === 3) {
      let currentScale = skullScale[0] ;
      let newScale = currentScale*scaleFactor;
      let newScaleArray = [newScale, newScale, newScale];
      setSkullScale(newScaleArray);
    }
  };

  // Load the 3D object asset
  const skullObject = Asset.fromModule(require('D:/newvrapp/assets/skull/12140_Skull_v3_L2.obj'));

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />
      <Viro3DObject
        source={{ uri: skullObject.uri }} // Use uri property of the Asset object
        position={position}
        scale={skullScale}
        rotation={rotation}
        type="OBJ"
        onDrag={moveObject}
        onRotate={rotateObject}
        onPinch={scaleSkullObject}
      />
    </ViroARScene>
  );
};

export default () => {
  return (
    <View style={styles.mainView}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: InitialScene }}
        style={styles.arScene}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  arScene: {
    flex: 1,
  },
});

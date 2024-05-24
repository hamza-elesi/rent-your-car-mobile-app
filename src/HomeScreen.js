import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from './firebase'; // Ensure firebase.js is correctly set up and exported

const face = require("./assets/logo.png");
const magnifying_glass = require("./assets/icons/magnifying-glass.png");

const image_v_1 = require("./assets/vehicles/v-1.png");
const image_v_2 = require("./assets/vehicles/v-2.png");
const image_v_3 = require("./assets/vehicles/v-3.png");
const image_v_4 = require("./assets/vehicles/v-4.png");

import localData from "./dataset/vehicles.json";

const HomeScreen = ({ navigation }) => {
    const [vehicles, setVehicles] = useState(localData.vehicles);
    const [filteredVehicles, setFilteredVehicles] = useState(localData.vehicles);

    useEffect(() => {
        const carsRef = ref(database, 'cars/');
        onValue(carsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const carsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Combine local vehicles with those from Firebase
                const combinedVehicles = [...localData.vehicles, ...carsArray];
                setVehicles(combinedVehicles);
                setFilteredVehicles(combinedVehicles);
            }
        });
    }, []);

    const getImage = (vehicle) => {
        // Check if the vehicle is from the local dataset or Firebase
        if (typeof vehicle.id === 'number') {
            if (vehicle.id === 1) return image_v_1;
            if (vehicle.id === 2) return image_v_2;
            if (vehicle.id === 3) return image_v_3;
            if (vehicle.id === 4) return image_v_4;
        } else {
            // For Firebase stored vehicles
            return vehicle.image.startsWith('http') ? { uri: vehicle.image } : require('./assets/noimage.png');
        }
    };

    const searchVehicles = (keyword) => {
        const lowercasedKeyword = keyword.toLowerCase();
        const results = vehicles.filter(vehicle => {
            return vehicle.make.toLowerCase().includes(lowercasedKeyword);
        });
        setFilteredVehicles(results);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerSection}>
                    <Image
                        source={face}
                        resizeMode="contain"
                        style={styles.faceIconStyle}
                    />
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.title}>Rent a Car</Text>
                </View>

                <View style={styles.searchSection}>
                    <View style={styles.searchPallet}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search a Car"
                            onChangeText={(text) => searchVehicles(text)}
                        />
                        <View style={styles.searchIconArea}>
                            <Image
                                source={magnifying_glass}
                                resizeMode="contain"
                                style={styles.magnifyingIconStyle}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.typesSection}>
                    <Text style={styles.typesTextActive}>All</Text>
                    <Text style={styles.typesText}>Suv</Text>
                    <Text style={styles.typesText}>Sedan</Text>
                    <Text style={styles.typesText}>Mpv</Text>
                    <Text style={styles.typesText}>Hatchback</Text>
                </View>

                <View style={styles.listSection}>
                    <Text style={styles.headText}>Most Rented</Text>
                    <ScrollView style={styles.elementPallet} contentContainerStyle={styles.scrollViewContent}>
                        {filteredVehicles.map((vehicle) => {
                            return (
                                <TouchableOpacity
                                    style={styles.element}
                                    key={vehicle.id}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('Info', { vehicle })}
                                >
                                    <View style={styles.infoArea}>
                                        <Text style={styles.infoTitle}>{vehicle.make} {vehicle.model}</Text>
                                        <Text style={styles.infoSub}>{vehicle.type}-{vehicle.transmission}</Text>
                                        <Text style={styles.infoPrice}>
                                            <Text style={styles.infoAmount}>${vehicle.price_per_day} </Text>/day
                                        </Text>
                                    </View>
                                    <View style={styles.imageArea}>
                                        <Image
                                            source={getImage(vehicle)}
                                            resizeMode="contain"
                                            style={styles.vehicleImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#e7e7e7",
    },
    container: {
        flex: 1,
        paddingRight: 35,
        paddingLeft: 35,
    },
    headerSection: {
        height: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    faceIconStyle: {
        width: 40,
        height: 40,
    },
    titleSection: {
        marginTop: 15,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "600",
    },
    searchSection: {
        marginTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: "center",
    },
    searchPallet: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        borderRadius: 8,
        width: "100%",
        height: 30,
        backgroundColor: "white",
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        height: 30,
        backgroundColor: "white",
    },
    searchIconArea: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    magnifyingIconStyle: {
        width: 24,
        height: 24,
        marginRight: -10,
    },
    typesSection: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    typesTextActive: {
        fontSize: 15,
        marginRight: 34,
        fontWeight: "bold",
        color: "black",
    },
    typesText: {
        fontSize: 15,
        marginRight: 33,
        fontWeight: "500",
        color: "#696969",
    },
    listSection: {
        marginTop: 25,
        flex: 1,
    },
    headText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    elementPallet: {
        marginLeft: -15,
        paddingLeft: 15,
        paddingRight: 15,
        width: "110%",
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    element: {
        height: 100,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 13,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    infoArea: {
        flex: 2,
        paddingRight: 10,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: "bold",
    },
    infoSub: {
        fontSize: 11,
        fontWeight: "600",
        color: "#696969",
    },
    infoPrice: {
        position: "absolute",
        bottom: 0,
        fontSize: 10,
        color: "#696969",
        fontWeight: "bold",
    },
    infoAmount: {
        fontSize: 12,
        color: "black",
        fontWeight: "600",
    },
    imageArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    vehicleImage: {
        width: "100%",
        height: "100%",
    },
});

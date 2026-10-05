import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";

// Estos componentes externos necesitan recibir las clases como estilos nativos.
cssInterop(Ionicons, { className: "style" });
cssInterop(MaterialIcons, { className: "style" });
cssInterop(Image, { className: "style" });

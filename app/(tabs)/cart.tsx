import { Text, View } from "react-native";
import { Sun } from "~/lib/icons/Sun";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Page() {
  return (
    <View>
      <Sun />
      <Button variant="default" size="lg" onPress={() => console.log("lol")}>
        <Text>Default</Text>
      </Button>
      <Input
        placeholder="Write some stuff..."
        value={"as"}
        onChangeText={() => console.log("lol")}
        aria-labelledby="inputLabel"
        aria-errormessage="inputError"
        className="w-1/2"
      />
    </View>
  );
}

import { RaydiumAmmCoder } from "../src/coder";
import { Idl } from "@coral-xyz/anchor";
import idl from "../idl.json";

(async () => {
  const coder = new RaydiumAmmCoder(idl as Idl);
  const result = coder.instruction.decode(
    Buffer.from("0bf70a9c01000000006417427900000000", "hex")
  );
  console.log(result);
})();

{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs =
    { nixpkgs, prisma-utils, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      prisma =
        (prisma-utils.lib.prisma-factory {
          inherit pkgs;
          # just copy these hashes for now, and then change them when nix complains about the mismatch
          prisma-fmt-hash = "sha256-uMK8ahkzlzLo/gH7+JmnJCnYjBQ8JKHGuA8ATP1FweM=";
          query-engine-hash = "sha256-vGCcu5J4PnlgERA/+dov7V19oIS31fihw0oJ9LXh9Pg=";
          libquery-engine-hash = "sha256-lVKV0lvNJq2OE/EH92es2gFwuF410V/qnr1L/fbkDfA=";
          schema-engine-hash = "sha256-hjNSM1ojUPIFNDtyTdI++lAncNUuZuMH0zSWV99rTlM=";
        }).fromBunLock
          ./server/bun.lock;  # <--- path to our bun.lock file that contains the version of prisma-engines.
      # NOTE: does not work with bun.lockb!

      #  Import prisma-client-go
      # prisma-client-go = pkgs.buildGoModule {
      #   pname = "prisma-client-go";
      #   version = "0.15.0"; # Replace with the desired version. Check the github releases
      #   src = pkgs.fetchFromGitHub {
      #     owner = "steebchen";
      #     repo = "prisma-client-go";
      #     rev = "v0.15.0"; # and match it here.  Use a real git tag/commit.
      #     hash = "sha256-gO9QxkjwslTsMIVLd/IOn9zsHM07l/w4ritt7n4BwgA=";
      #   };
      #   vendorHash = "sha256-a9yUKMOMV1+r+S1GAqaX+E21KItll7P2+cIx0nX8jSU=";  # Replace with correct vendor hash. Nix will tell you.
      #   # Optional: If you have build flags or other settings
      #   # buildFlagsArray = [ "-tags=fts5" ];
      # };

    in
    {
      devShells.${system}.default = pkgs.mkShell {
        env = prisma.env;
        buildInputs = [
          pkgs.nodejs_22
          pkgs.bun
          # prisma-client-go # Add prisma-client-go to buildInputs
        ];
        # or, you can use `shellHook` instead of `env` to load the same environment variables.
        shellHook = prisma.shellHook;

        # Set up the alias within the shell
        # shellHook = ''
        #   alias prisma="go run github.com/steebchen/prisma-client-go"
        # '';
      };
    };
}
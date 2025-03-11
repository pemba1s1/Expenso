{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs = { self, nixpkgs, prisma-utils }:
    let
      system = "x86_64-linux"; # Or your system
      pkgs = nixpkgs.legacyPackages.${system};

      prisma = (prisma-utils.lib.prisma-factory {
        inherit pkgs;
        # Replace with your actual hashes! Run `nix develop` and let Nix tell you the correct hashes.
        prisma-fmt-hash = "sha256-4zsJv0PW8FkGfiiv/9g0y5xWNjmRWD8Q2l2blSSBY3s=";
        query-engine-hash = "sha256-6ILWB6ZmK4ac6SgAtqCkZKHbQANmcqpWO92U8CfkFzw=";
        libquery-engine-hash = "sha256-n9IimBruqpDJStlEbCJ8nsk8L9dDW95ug+gz9DHS1Lc=";
        schema-engine-hash = "sha256-j38xSXOBwAjIdIpbSTkFJijby6OGWCoAx+xZyms/34Q=";
      }).fromBunLock ./server/bun.lock;

    in {
      devShells.${system}.default = pkgs.mkShell {
        # Load Prisma's environment variables
        packages = [ prisma ];

        # You can add other packages here as needed
        # buildInputs = [ pkgs.nodejs-18_x ];

        # Optional:  Set a custom shell hook
        shellHook = ''
          echo "Prisma dev shell activated!"
        '';
      };
    };
}
export const COLLECTION_NAME = "Gorilla Galaxy";
export const COLLECTION_SYMBOL = "Gorilla";
export const SHUTTLE_PASS_SYMBOL_NAME = "Shuttle";
export const SHUTTLE_PASS_MAX_HOLD_COUNT = 3;

export const STAKE_STATUS = {
    UNSTAKED:   0,
    STAKED:     1,
};
export const STAKE_DATA_SIZE = 8 + 1 + 32 + 32 + 32 +8 + 1;

export const STAKE_CONTRACT_IDL = 
{
  "version": "0.1.0",
  "name": "solana_anchor",
  "instructions": [
    {
      "name": "initPool",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rand",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "rewardAmount",
          "type": "u64"
        },
        {
          "name": "period",
          "type": "i64"
        },
        {
          "name": "withdrawable",
          "type": "u8"
        },
        {
          "name": "stakeCollection",
          "type": "string"
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeData",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "rand",
            "type": "publicKey"
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "rewardAccount",
            "type": "publicKey"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "period",
            "type": "i64"
          },
          {
            "name": "withdrawable",
            "type": "u8"
          },
          {
            "name": "stakeCollection",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "StakeData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unstaked",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "account",
            "type": "publicKey"
          },
          {
            "name": "stakeTime",
            "type": "i64"
          },
          {
            "name": "withdrawnNumber",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TokenMintToFailed",
      "msg": "Token mint to failed"
    },
    {
      "code": 6001,
      "name": "TokenSetAuthorityFailed",
      "msg": "Token set authority failed"
    },
    {
      "code": 6002,
      "name": "TokenTransferFailed",
      "msg": "Token transfer failed"
    },
    {
      "code": 6003,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6004,
      "name": "InvalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6005,
      "name": "InvalidMetadata",
      "msg": "Invalid metadata"
    },
    {
      "code": 6006,
      "name": "InvalidStakeData",
      "msg": "Invalid stakedata account"
    },
    {
      "code": 6007,
      "name": "InvalidTime",
      "msg": "Invalid time"
    },
    {
      "code": 6008,
      "name": "InvalidPeriod",
      "msg": "Invalid Period"
    },
    {
      "code": 6009,
      "name": "AlreadyUnstaked",
      "msg": "Already unstaked"
    }
  ]
};
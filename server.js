const WebSocket = require("ws");
const PORT = 9091;
let clientIdCounter = 0;
let count = 0; // ✅ This is the only count declaration you need
// Add flag so TerminalHealthResponse messages are sent only once globally
let terminalHealthSent = false;

// Add counter for dynamic denominations
let acceptNoteCounter = 0;
const denominations = ["100~1"];

// add separate persisting counter for AcceptNoteCompleted parity
let acceptNoteCompletedCounter = 0;

// add counter for ReadData parity
let readDataCounter = 0;

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
});

wss.on("connection", (ws) => {
  ws.id = ++clientIdCounter;
  console.log(`🔌 Client #${ws.id} connected`);

  // // Send ModeResponse immediately upon connection
  ws.send(
    JSON.stringify({
      Device: "KioskCore",
      ResponseData: {
        State: "ServiceState",
        Status: "IN_SERVICE",
        Name: "ModeResponse",
        Type: "ModeResponse",
        Detail: null,
      },
    }),
  );
  ws.send(
    JSON.stringify({
      Device: "KioskCore",
      ResponseData: {
        Sensors: [
          { Sensor: "AUDIO_GUIDANCE", Status: true },
          { Sensor: "DOOR1", Status: true },
          { Sensor: "DOOR2", Status: true },
          { Sensor: "DOOR3", Status: true },
          { Sensor: "DOOR4", Status: true },
        ],
        ErrorCode: null,
        Name: "TerminalHealthResponse",
        Type: "TerminalHealthResponse",
        Detail: "OK",
      },
    }),
  );
  // ws.send(
  //   JSON.stringify({
  //     Type: "GetTimeZoneResponse",
  //     Name: "GetTimeZoneResponse",
  //     Detail: "OK",
  //     TimeZone: "USA",
  //     Device: "KioskCore",
  //   })
  // );
  // Send TerminalHealthResponse only once across the whole server lifetime
  // if (!terminalHealthSent) {
  //   terminalHealthSent = true;

  //   setTimeout(() => {
  //     ws.send(
  //       JSON.stringify({
  //         SensorType: "DOOR2",
  //         Status: true,
  //         ErrorCode: null,
  //         Name: "TerminalHealthResponse",
  //         Type: "TerminalHealthResponse",
  //         Detail: "OK",
  //       })
  //     );
  //   }, 500);

  //   setTimeout(() => {
  //     ws.send(
  //       JSON.stringify({
  //         SensorType: "DOOR2",
  //         Status: false,
  //         ErrorCode: null,
  //         Name: "TerminalHealthResponse",
  //         Type: "TerminalHealthResponse",
  //         Detail: "OK",
  //       })
  //     );
  //   }, 10000);

  //   setTimeout(() => {
  //     ws.send(
  //       JSON.stringify({
  //         SensorType: "DOOR2",
  //         Status: true,
  //         ErrorCode: null,
  //         Name: "TerminalHealthResponse",
  //         Type: "TerminalHealthResponse",
  //         Detail: "OK",
  //       })
  //     );
  //   }, 20000);

  //   setTimeout(() => {
  //     ws.send(
  //       JSON.stringify({
  //         SensorType: "DOOR2",
  //         Status: false,
  //         ErrorCode: null,
  //         Name: "TerminalHealthResponse",
  //         Type: "TerminalHealthResponse",
  //         Detail: "OK",
  //       })
  //     );
  //   }, 30000);
  // }
  console.log(`📤 Sent ModeResponse to Client #${ws.id}`);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const header = data.Header || data.Name;
      const parsedPayload = JSON.parse(data.Payload || "{}");
      const requestName = parsedPayload.Name;

      console.log(`📩 Client #${ws.id} sent:`, header, parsedPayload);

      /** -------------------------------
       * KIOSKCORE DEVICE RESPONSES
       * ------------------------------- */
      if (requestName === "GetDeviceConfig" || requestName === "DeviceConfig") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "KioskCore",
              ResponseData: {
                ApplicationVersion: "02.00.05.09",
                kioskCassettes: [1, 2],
                // MachineNumber: "12345678",
                MachineNumber: "TERM0001",
                // MachineNumber: "TRMP1001",
                // 12345678
                // MachineNumber: "RAAS1003",
                PartnerID: "100001",
                CardReaderType: "MOTOR",
                CashDispenserType: "BRM",
                CashAcceptorType: "BRM",
                NFCReaderType: "P2P",
                FingerprintReaderType: "NONE",
                ReceiptPrinterType: "NORMAL",
                ResolutionWidth: "1024",
                ResolutionHeight: "768",
                LocationX: "0",
                LocationY: "0",
                HelpActive: null,
                VideoDeviceName: "USB Video Device",
                AudioDeviceName: "",
                SecondaryAudioDeviceName: "",
                MicDeviceName: "",
                SecondaryMicDeviceName: "",
                MicVolume: "80",
                Name: "DeviceConfigResponse",
                Type: "DeviceConfig",
                Detail: null,
                IsSettlementRequired: false,
                IsInitialSetup: true,
                ErrorCode: "0000",
                ErrorTitle: "Success",
                AtmModel: "UK2",
                // ATMProvider: "liliatm",
                ErrorDescription: "The operation completed successfully.",
                // Type: "DeviceConfig",
                // Name: "DeviceConfigResponse",
                // Detail: null,
                // ApplicationVersion: null,
                // MachineNumber: "DEMO0002",
                // ResolutionWidth: null,
                // ResolutionHeight: null,
                // LocationX: null,
                // LocationY: null,
                // HelpActive: null,
                // VideoBxDeviceName: null,
                // AudioBxDeviceName: null,
                // SecondaryAudioBxDeviceName: null,
                // MicBxDeviceName: null,
                // SecondaryMicBxDeviceName: null,
                // MicVolume: null,
                // PartnerID:"100001",
                // EppSerialNumber: null,
                // RemoteKeyLoaded: null,
                // IsSettlementRequired: false,
                // IsInitialSetup: true,
                // AtmModel: "UK2",
                // ErrorCode: "0000",
                // ErrorTitle: "Success",
                // ErrorDescription: "The operation completed successfully.",
              },
            }),
          );
        }, 500);
      }

      if (requestName === "GetMode" || requestName === "ModeRequest") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "KioskCore",
              ResponseData: {
                State: "ServiceState",
                Status: "IN_SERVICE",
                Name: "ModeResponse",
                Type: "ModeResponse",
                Detail: null,
              },
            }),
          );
        }, 500);
      }

      /** -------------------------------
       * KIOSKSTATUS DEVICE RESPONSES
       * ------------------------------- */
      if (
        requestName === "GetAllDeviceStatus" ||
        requestName === "AllDeviceStatus"
      ) {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "KioskStatus",
              ResponseData: {
                CardReaderStatus: {
                  MediaStatus: "NOTPRESENT",
                  RetainBinStatus: "OK",
                  RetractedCount: "0",
                  MaxRetainCount: "10",
                  ChipPowerStatus: null,
                  PSTDX: null,
                  DeviceStatus: "DEVONLINE",
                  IsAvailable: true,
                  Name: "CardReaderStatusResponse",
                  Type: "CardReaderStatus",
                  Detail: null,
                },
                CashAcceptorStatus: {
                  AcceptorStatus: "OK",
                  EscrowStatus: "EMPTY",
                  StackerStatus: "LOW",
                  CashDetails: {
                    currentBalance: 70008,
                    availableBalance: 70000,
                    IsCashBoxAvailable: true,
                    dpcBalance: 8,
                    cassetteInfo: [
                      {
                        cassetteId: "1",
                        denom: 5,
                        count: 16,
                      },
                      {
                        cassetteId: "2",
                        denom: 20,
                        count: 10,
                      },
                      {
                        cassetteId: "REJ",
                        denom: 0,
                        count: 0,
                      },
                      {
                        cassetteId: "DPC",
                        denom: 0,
                        count: 8,
                      },
                    ],
                  },
                  DeviceStatus: "DEVONLINE",
                  IsAvailable: true,
                  Name: "CashAcceptorStatusResponse",
                  Type: "CashAcceptorStatus",
                  Detail: null,
                },
                CashDispenserStatus: {
                  RetainBinStatus: null,
                  RetractedBinStatus: "",
                  MaxDispenseItems: 70,
                  NumberOfLogicalUnits: 5,
                  CashDetails: {
                    currentBalance: 70008,
                    availableBalance: 70000,
                    dpcBalance: 8,
                    cassetteInfo: [
                      {
                        cassetteId: "1",
                        denom: 5,
                        count: 15,
                      },
                      {
                        cassetteId: "2",
                        denom: 20,
                        count: 20,
                      },
                      {
                        cassetteId: "REJ",
                        denom: 0,
                        count: 0,
                      },
                      {
                        cassetteId: "DPC",
                        denom: 0,
                        count: 8,
                      },
                    ],
                  },
                  DeviceStatus: "DEVONLINE",
                  IsAvailable: true,
                  Name: "CashDispenserStatusResponse",
                  Type: "CashDispenserStatus",
                  Detail: null,
                },
                PinPadStatus: {
                  DeviceStatus: "DEVONLINE",
                  IsAvailable: true,
                  Name: "PinPadStatusResponse",
                  Type: "PinPadStatus",
                  Detail: null,
                },
                ReceiptPrinterStatus: {
                  PaperStatus: "FULL",
                  TonerStatus: null,
                  DeviceStatus: "DEVONLINE",
                  IsAvailable: true,
                  Name: "ReceiptPrinterStatusResponse",
                  Type: "ReceiptPrinterStatus",
                  Detail: null,
                },
                CardDispenserStatus: {
                  CardDispenserHopperInfoList: null,
                  MediaStatus: null,
                  TonerStatus: null,
                  RetainBinStatus: null,
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: true,
                  Name: "CardDispenserStatusResponse",
                  Type: "CardDispenserStatus",
                  Detail: null,
                },
                DocumentPrinterStatus: {
                  PaperStatus: null,
                  TonerStatus: null,
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "DocumentPrinterStatusResponse",
                  Type: "DocumentPrinterStatus",
                  Detail: null,
                },
                IDScannerStatus: {
                  MediaStatus: null,
                  RetainBinStatus: null,
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "IDScannerStatusResponse",
                  Type: "IDScannerStatus",
                  Detail: null,
                },
                DocumentScannerStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "DocumentScannerStatusResponse",
                  Type: "DocumentScannerStatus",
                  Detail: null,
                },
                PassportScannerStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "PassportScannerStatusResponse",
                  Type: "PassportScannerStatus",
                  Detail: null,
                },
                IDReaderStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "IDReaderStatusResponse",
                  Type: "IDReaderStatus",
                  Detail: null,
                },
                RFIDReaderStatus: {
                  DeviceStatus: "DEVONLINE",
                  IsAvailable: true,
                  Name: "RFIDReaderStatusResponse",
                  Type: "RFIDReaderStatus",
                  Detail: null,
                },
                SignpadStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "SignpadStatusResponse",
                  Type: "SignpadStatus",
                  Detail: null,
                },
                BarcodeReaderStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: true,
                  Name: "BarcodeReaderStatusResponse",
                  Type: "BarcodeReaderStatus",
                  Detail: null,
                },
                GuideLightStatus: {
                  DeviceStatus: "DEVONLINE",
                  isAvailable: true,
                  Name: "GuideLightStatusResponse",
                  Type: "GuideLightStatus",
                  Detail: null,
                },
                SensorStatus: {
                  HandSetStatus: "NOTAVAILABLE",
                  ProximityStatus: "NOTPRESENT",
                  EnhancedAudioStatus: "NOTPRESENT",
                  OperatorSwitchStatus: "RUN",
                  SeismicStatus: "OFF",
                  TamperStatus: "OFF",
                  HeatStatus: "OFF",
                  DeviceStatus: "DEVONLINE",
                  IsAvailable: true,
                  Name: "SensorStatusResponse",
                  Type: "SensorStatus",
                  Detail: null,
                },
                CoinAcceptorStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "CoinAcceptorStatusResponse",
                  Type: "CoinAcceptorStatus",
                  Detail: null,
                },
                CoinDispenserStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "CoinDispenserStatusResponse",
                  Type: "CoinDispenserStatus",
                  Detail: null,
                },
                CoinDispenser2Status: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "CoinDispenserStatusResponse",
                  Type: "CoinDispenserStatus",
                  Detail: null,
                },
                MixedMediaAcceptorStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "MixedMediaAcceptorStatusResponse",
                  Type: "MixedMediaAcceptorStatus",
                  Detail: null,
                },
                DepositoryStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "DepositoryStatusResponse",
                  Type: "DepositoryStatus",
                  Detail: null,
                },
                CheckAcceptorStatus: {
                  DeviceStatus: "DEVNODEVICE",
                  IsAvailable: null,
                  Name: "CheckAcceptorStatusResponse",
                  Type: "CheckAcceptorStatus",
                  Detail: null,
                },
                Name: "AllDeviceStatusResponse",
                Type: "AllDeviceStatus",
                Detail: null,
                ErrorCode: "0000",
                ErrorTitle: "Success",
                ErrorDescription: "The operation completed successfully.",
              },
            }),
          );
        }, 500);
      }

      /** -------------------------------
       * CASH ACCEPTOR — ACCEPT ONE NOTE
       * ------------------------------- */
      if (requestName === "AcceptNote") {
        // Get dynamic denomination
        const currentDenom =
          denominations[acceptNoteCounter % denominations.length];
        acceptNoteCounter++;

        // Determine if this call is an even-numbered call
        const isEvenCall = acceptNoteCounter % 2 === 0;

        // -----------------------  YASHWANTH'S -----------------------------
        // 1) CommandReadyCompleted (OK)
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation failed",
            }),
          );
        }, 300); // tweak timings as you like

        // 2) TaskCompleted (SHUTTER_OPEN)
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "TaskCompleted",
              Name: "TaskCompleted",
              Detail: "SHUTTER_OPEN",
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation failed",
            }),
          );
        }, 1000);

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ItemsInserted",
              Name: "ItemsInserted",
              Detail: "OK",
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation failed",
            }),
          );
        }, 2800);

        // 4) TaskCompleted (SHUTTER_CLOSE)
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "TaskCompleted",
              Name: "TaskCompleted",
              Detail: "SHUTTER_CLOSE",
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 2600);

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "BillAcceptor",
              ResponseData: {
                Type: "AcceptNoteCompleted",
                Name: "AcceptNoteCompleted",
                Detail: "OK",
                CashInStatus: currentDenom, // Dynamic denomination
                // CashInStatus: "50~1", // one note of 100
                StackerStatus: "LOW",
                LastRefusedCount: "0",
                EscrowStatus: "PRESENT",
                ErrorCode: "0000",
                ErrorTitle: "Success",
                ErrorDescription: "The operation completed successfully.",
              },
            }),
          );
        }, 6000);
      }

      // setTimeout(() => {
      //   ws.send(
      //     JSON.stringify({
      //       Type: "ItemsPresented",
      //       Name: "ItemsPresented",
      //       Detail: "OK",
      //       Device: "BillAcceptor",
      //       itemRefusedReason: "NULL",
      //       ErrorCode: "0000",
      //       ErrorTitle: "Success",
      //       ErrorDescription: "The operation completed successfully.",
      //     })
      //   );
      // }, 3000);

      // 5) Conditional: if this is an even AcceptNote call -> ItemsPresented
      if (acceptNoteCounter === 3) {
        // setTimeout(() => {
        //   ws.send(
        //     JSON.stringify({
        //       CashInStatus: null,
        //       StackerStatus: "LOW",
        //       LastRefusedCount: "0",
        //       // EscrowStatus: "PRESENT",
        //       EscrowStatus: "EMPTY",
        //       ErrorCode: "BA0000",
        //       Type: "AcceptNoteCompleted",
        //       Name: "AcceptNoteCompleted",
        //       Detail: "TIMEOUT",
        //       Device: "BillAcceptor",
        //       ErrorDescription: "The operation failed",
        //     }),
        //   );
        // }, 6000);
        // setTimeout(() => {
        //   ws.send(
        //     JSON.stringify({
        //       Type: "ItemsPresented",
        //       Name: "ItemsPresented",
        //       Detail: "OK",
        //       Device: "BillAcceptor",
        //       itemRefusedReason: "NULL",
        //       ErrorCode: "0000",
        //       ErrorTitle: "Success",
        //       ErrorDescription: "The operation failed by cash acceptor .",
        //     }),
        //   );
        // }, 3000);
        // Do NOT send AcceptNoteCompleted when ItemsPresented is used
      } else {
        // odd calls -> send AcceptNoteCompleted (wrapped in ResponseData)
        // setTimeout(() => {
        //   // use separate counter so AcceptNoteCompleted detail toggles independently
        //   acceptNoteCompletedCounter++;
        //   const isEvenAcceptNoteCompleted =
        //     acceptNoteCompletedCounter % 2 === 0;
        //   const acceptNoteCompletedDetail = isEvenAcceptNoteCompleted
        //     ? "OK"
        //     : "OK";
        //   ws.send(
        //     JSON.stringify({
        //       Device: "BillAcceptor",
        //       ResponseData: {
        //         Type: "AcceptNoteCompleted",
        //         Name: "AcceptNoteCompleted",
        //         Detail: acceptNoteCompletedDetail,
        //         CashInStatus: currentDenom, // Dynamic denomination
        //         StackerStatus: "LOW",
        //         LastRefusedCount: "0",
        //         EscrowStatus: "PRESENT",
        //       },
        //     })
        //   );
        // }, 6000);
        // setTimeout(() => {
        //   ws.send(
        //     JSON.stringify({
        //       CashInStatus: currentDenom,
        //       StackerStatus: "LOW",
        //       LastRefusedCount: "0",
        //       // EscrowStatus: "PRESENT",
        //       EscrowStatus: "EMPTY",
        //       ErrorCode: "0000",
        //       Type: "AcceptNoteCompleted",
        //       Name: "AcceptNoteCompleted",
        //       Detail: "OK",
        //       Device: "BillAcceptor",
        //       ErrorDescription: "The cash acceptor failed",
        //     })
        //   );
        // }, 3000);
      }

      // setTimeout(() => {
      //   ws.send(
      //     JSON.stringify({
      //       CashInStatus: currentDenom,
      //       StackerStatus: "LOW",
      //       LastRefusedCount: "0",
      //       // EscrowStatus: "PRESENT",
      //       EscrowStatus: "EMPTY",
      //       ErrorCode: "0000",
      //       Type: "AcceptNoteCompleted",
      //       Name: "AcceptNoteCompleted",
      //       Detail: "OK",
      //       Device: "BillAcceptor",

      //       ErrorDescription: "The cash acceptor failed",
      //     })
      //   );
      // }, 3000);

      //------------------------  MINE --------------------------------
      // setTimeout(() => {
      //   ws.send(
      //     JSON.stringify({
      //       Type: "CommandReadyCompleted",
      //       Name: "CommandReadyCompleted",
      //       Detail: "OK",
      //       Device: "BillAcceptor",
      //     })
      //   );
      // }, 3000);

      // setTimeout(() => {
      //   ws.send(
      //     JSON.stringify({
      //       Type: "ItemsInserted",
      //       Name: "ItemsInserted",
      //       Detail: "OK",
      //       Device: "BillAcceptor",
      //     })
      //   );
      // }, 5000);
      // setTimeout(() => {
      //   ws.send(
      //     JSON.stringify({
      //       Type: "TaskCompleted",
      //       Name: "TaskCompleted",
      //       Detail: "SHUTTER_CLOSE",
      //       Device: "BillAcceptor",
      //     })
      //   );
      // }, 3000);

      //   setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "BillAcceptor",
      //         ResponseData: {
      //           Type: "AcceptNoteCompleted",
      //           Name: "AcceptNoteCompleted",
      //           Detail: "OK",
      //           CashInStatus: currentDenom, // Dynamic denomination
      //           // CashInStatus: "50~1", // one note of 100
      //           StackerStatus: "LOW",
      //           LastRefusedCount: "0",
      //           EscrowStatus: "EMPTY",
      //           ErrorCode: "0000",
      //           ErrorTitle: "Success",
      //           ErrorDescription: "The operation completed successfully.",
      //         },
      //       }),
      //     );
      //   }, 6000);
      // }

      if (requestName === "GetTerminalInfo") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "KioskCore",
              ResponseData: {
                Name: "GetTerminalInfoCompleted",
                Type: "GetTerminalInfoCompleted",
                Detail: "OK",
                ErrorCode: "0000",
                ErrorTitle: "Success",
                ErrorDescription: "Success",
                TechnicalMessage: "",
                Vendor: "Hyosung",
                ATMProvider: "liliatm",
                Model: "MX8800",
                AtmType: "NonRecycler",
                TerminalId: "TERM0001",
                CustomerNumber: "10001",
                IsCardReaderAvailable: true,
                IsCardDispenserAvailable: false,
                IsBarcodeScannerAvailable: true,
                IsBillAcceptorAvailable: true,
                IsReceiptPrinterAvailable: true,
                IsCashDispenserAvailable: true,
                IsPinpadAvailable: true,
                IsIndicatorAvailable: true,
                HostConfig: [
                  {
                    TerminalId: "TERM0001",
                    KeyMode: "TR31",
                    TransactionType: "ATM",
                  },
                ],
              },
            }),
          );
        }, 2000);
      }

      /** -------------------------------
       * CASH ACCEPTOR — COMMIT (STORE)
       * ------------------------------- */
      if (requestName === "CommitNote") {
        // Optional: echo command ready
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation failed.",
            }),
          );
        }, 3000);

        //Primary: tell client commit finished successfully
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommitNoteCompleted",
              Name: "CommitNoteCompleted",
              Detail: "OK",
              ErrorCode: null,
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 4000);
      }

      // Your UI calls get status after commit — respond coherently
      // if (requestName === "GetBillAcceptorStatus") {
      //   setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Type: "CashAcceptorStatusResponse",
      //         Name: "CashAcceptorStatusResponse",
      //         Detail: "OK",
      //         IsAvailable: true,
      //         EscrowStatus: "EMPTY", // throat empty
      //         StackerStatus: "LOW", // stored note inside
      //         Device: "BillAcceptor",
      //         ErrorCode: "0000",
      //         ErrorTitle: "Success",
      //         ErrorDescription: "The operation completed successfully.",
      //       }),
      //     );
      //   }, 300);
      // }

      // Your UI calls get status after commit — respond coherently
      if (requestName === "GetBillAcceptorStatus") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              IsAvailable: true,
              AcceptorStatus: "OK",
              EscrowStatus: "PRESENT",
              StackerStatus: "LOW",
              CashDetails: {
                currentBalance: 2000,
                availableBalance: 2000,
                // IsCashBoxAvailable: true,
                dpcBalance: 0,
                cassetteInfo: [
                  {
                    cassetteId: "1",
                    denom: 20,
                    count: 100,
                  },
                  {
                    cassetteId: "2",
                    denom: 5,
                    count: 0,
                  },
                ],
              },
              Name: "GetBillAcceptorStatus",
              Type: "GetBillAcceptorStatus",
              Detail: null,
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
              Device: "BillAcceptor",
            }),
          );
        }, 300);
      }

      if (requestName === "GetBillDispenserStatus") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CashDispenserStatusResponse",
              Name: "CashDispenserStatusResponse",
              Detail: "OK",
              RetainBinStatus: null,
              RetractedBinStatus: "",
              MaxDispenseItems: 70,
              NumberOfLogicalUnits: 5,
              IsAvailable: true,
              CashDetails: [
                {
                  CurrencyID: "USD",
                  Value: "5",
                  Status: "LOW",
                  Count: "70",
                  UnitType: "BILLCASSETTE",
                },
                {
                  CurrencyID: "USD",
                  Value: "10",
                  Status: "LOW",
                  Count: "83",
                  UnitType: "BILLCASSETTE",
                },
                {
                  CurrencyID: "USD",
                  Value: "20",
                  Status: "LOW",
                  Count: "94",
                  UnitType: "BILLCASSETTE",
                },
                {
                  CurrencyID: "USD",
                  Value: "50",
                  Status: "LOW",
                  Count: "43",
                  UnitType: "BILLCASSETTE",
                },
              ],
              DeviceStatus: "DEVONLINE",
              IsAvailable: true,
              Device: "BillDispenser",
            }),
          );
        }, 300);
      }

      /** -------------------------------
       * CASH RETURN
       * ------------------------------- */

      if (requestName === "ReturnNote") {
        // 1) ValidTokenResponse
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ValidTokenResponse",
              Name: "ValidTokenResponse",
              Detail: "OK",
              Device: "CoreAPI",
            }),
          );
        }, 500);

        // 2) EncryptionCompleted
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "EncryptionCompleted",
              Name: "EncryptionCompleted",
              Detail: "OK",
              TransactionDetail: {},
              Device: "CoreAPI",
            }),
          );
        }, 800);

        // 3) CommandReadyCompleted
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "CoreAPI",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 900);

        // 4) ReturnNoteCompleted
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ReturnNoteCompleted",
              Name: "ReturnNoteCompleted",
              Detail: "CANCELLED",
              AcceptorStatus: "READY", // example status
              EscrowStatus: "EMPTY", // example status
              StackerStatus: "FULL", // example status
              ErrorCode: null,
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 1000);

        // 5) ItemsPresented
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ItemsPresented",
              Name: "ItemsPresented",
              Detail: "OK",
              ItemRefusedReason: "", // or null
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 2000);

        // 6) ItemsTaken
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ItemsTaken",
              Name: "ItemsTaken",
              Detail: "OK", // or "ERROR" if you want to simulate an error
              Device: "BillAcceptor",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 3000);
      }

      if (requestName === "RetractNote") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "RetractNoteCompleted",
              Name: "RetractNoteCompleted",
              Detail: "OK",
              RetractedNoteDetail: [
                { NoteType: "GENUINE", Value: 100, Currency: "USD" },
              ],
              FakeNoteList: [{ NoteType: "FAKE", Value: 0, Currency: "USD" }],
              ErrorCode: null,
              Device: "BillAcceptor",
            }),
          );
        }, 1000);
      }

      if (requestName === "GetCardDispenserStatus") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "GetCardDispenserStatusCompleted",
              Name: "GetCardDispenserStatusCompleted",
              Detail: "OK",
              Device: "CardDispenser",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
              Data: {
                IsConnected: true,
                Transporter: "OK",
                Outlet: "OK",
                RejectBin: "OK",
                CardHopper: "OK",
                RetrievalSolenoid: "OK",
              },
            }),
          );
        }, 1000);
      }

      if (requestName === "DispenseWait") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "DispenseCardCompleted",
              Name: "DispenseCardCompleted",
              Detail: "OK",
              Device: "CardDispenser",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
              Data: {
                Track1:
                  "%xxxx345400680xxxx^0006371682882520102^27125211000000435000000?;",
                Track2: "",
                Track3: "",
              },
            }),
          );
        }, 1000);
      }

      if (requestName === "Eject") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "EjectCompleted",
              Name: "EjectCompleted",
              Detail: "OK",
              Device: "CardDispenser",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
          console.log(
            "✅ [CardReader] Account type selected - Command ready completed.",
          );
        }, 1000);
      }

      /** -------------------------------
       * CASH DISPENSER — 4-EVENT POSITIVE FLOW
       * ------------------------------- */
      if (
        requestName === "DispenseByAmount" ||
        requestName === "DispenseByCount"
      ) {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "BillDispenser",
              date: "CommandReadyCompleted",
              data: "CommandReadyCompleted",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
          console.log("✅ [Dispenser] Command ready completed successfully.");

          setTimeout(() => {
            ws.send(
              JSON.stringify({
                Type: "DispenseNoteCompleted",
                Name: "DispenseNoteCompleted",
                Detail: "OK",
                ErrorCode: null,
                Device: "BillDispenser",
                ErrorCode: "0000",
                ErrorTitle: "Success",
                ErrorDescription: "The operation failed.",
              }),
            );
            console.log("💸 [Dispenser] Dispensing cash...");

            setTimeout(() => {
              ws.send(
                JSON.stringify({
                  Type: "ItemsPresented",
                  Name: "ItemsPresented",
                  Detail: "OK",
                  Device: "BillDispenser",
                  ErrorCode: "0000",
                  ErrorTitle: "Success",
                  ErrorDescription: "The operation failed",
                }),
              );
              console.log("📤 [Dispenser] Items presented successfully.");

              setTimeout(() => {
                ws.send(
                  JSON.stringify({
                    Type: "ItemsTaken",
                    Name: "ItemsTaken",
                    Detail: "OK",
                    Device: "BillDispenser",
                  }),
                );
                console.log(
                  "🤝 [Dispenser] Customer took the cash (transactionResult=true).",
                );
              }, 2000); // Wait 2s after presenting before "taken"
            }, 2000); // Wait 2s after dispense before present
          }, 3000); // Wait 3s after ready before dispense
        }, 2000); // Initial wait before ready
      }

      /** -------------------------------
       * CARD READER
       * ------------------------------- */
      if (requestName === "StartAcceptCard") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "CardReader",
              date: "CommandReadyCompleted",
              data: "CommandReadyCompleted",
            }),
          );
          console.log("✅ [CardReader] Command ready completed successfully.");
        }, 2000);
      }

      // For selectTransactionType method
      if (requestName === "SelectTransactionType") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "CardReader",
              date: "CommandReadyCompleted",
              data: "CommandReadyCompleted",
            }),
          );
          console.log(
            "✅ [CardReader] Transaction type selection - Command ready completed.",
          );
        }, 1000);
      }

      if (requestName === "SetPurchaseAmount") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "CardReader",
              date: "CommandReadyCompleted",
              data: "CommandReadyCompleted",
            }),
          );
          console.log(
            "✅ [CardReader] Purchase amount set - Command ready completed.",
          );
        }, 1000);
      }

      if (requestName === "SelectAccountType") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "CardReader",
              date: "CommandReadyCompleted",
              data: "CommandReadyCompleted",
            }),
          );
          console.log(
            "✅ [CardReader] Account type selected - Command ready completed.",
          );
        }, 1000);
      }

      if (requestName === "EjectCard") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "EjectCompleted",
              Name: "EjectCompleted",
              Detail: "OK",
              Device: "CardReader",
            }),
          );
          console.log(
            "✅ [CardReader] Account type selected - Command ready completed.",
          );
        }, 1000);
      }

      if (requestName === "AcceptEmvCard") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "CardReader",
              date: "CommandReadyCompleted",
              data: "CommandReadyCompleted",
            }),
          );
          console.log("✅ [CardReader] Command ready completed successfully.");

          setTimeout(() => {
            ws.send(
              JSON.stringify({
                Type: "AcceptCardStarted",
                Name: "AcceptCardStarted",
                Detail: "OK",
                Device: "CardReader",
              }),
            );
            console.log("🎴 [CardReader] Card acceptance started...");

            setTimeout(() => {
              ws.send(
                JSON.stringify({
                  Type: "AcceptCardCompleted",
                  Name: "AcceptCardCompleted",
                  Detail: "OK",
                  Device: "CardReader",
                }),
              );
              console.log(
                "💳 [CardReader] Card acceptance completed successfully.",
              );
            }, 3000); // Wait 3s for card acceptance
          }, 1500); // Wait 1.5s after ready
        }, 2000); // Initial wait
      }

      // For encryptPin method (from PinPad)
      if (requestName === "EnterPin") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "PinPad",
              ResponseData: {
                Type: "EnterPinStarted",
                Name: "EnterPinStarted",
                Detail: "OK",
              },
            }),
          );
        }, 1000); // Initial wait

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "PinPad",
              ResponseData: {
                Type: "SecureKeyPressed",
                Name: "SecureKeyPressed",
                Detail: "OK",
                PressedKey: "KEY_1",
                InputData: "*",
              },
            }),
          );
          console.log("🔢 [PinPad] Secure key pressed (1/4)...");

          setTimeout(() => {
            ws.send(
              JSON.stringify({
                Device: "PinPad",
                ResponseData: {
                  Type: "SecureKeyPressed",
                  Name: "SecureKeyPressed",
                  Detail: "OK",
                  PressedKey: "KEY_1",
                  InputData: "*",
                },
              }),
            );
            console.log("🔢 [PinPad] Secure key pressed (2/4)...");

            setTimeout(() => {
              ws.send(
                JSON.stringify({
                  Device: "PinPad",
                  ResponseData: {
                    Type: "SecureKeyPressed",
                    Name: "SecureKeyPressed",
                    Detail: "OK",
                    PressedKey: "KEY_1",
                    InputData: "*",
                  },
                }),
              );
              console.log("🔢 [PinPad] Secure key pressed (3/4)...");

              setTimeout(() => {
                ws.send(
                  JSON.stringify({
                    Device: "PinPad",
                    ResponseData: {
                      Type: "SecureKeyPressed",
                      Name: "SecureKeyPressed",
                      Detail: "OK",
                      PressedKey: "KEY_1",
                      InputData: "*",
                    },
                  }),
                );
                console.log("🔢 [PinPad] Secure key pressed (4/4)...");

                setTimeout(() => {
                  ws.send(
                    JSON.stringify({
                      Device: "PinPad",
                      ResponseData: {
                        Type: "EnterPinCompleted",
                        Name: "EnterPinCompleted",
                        Detail: "OK",
                      },
                    }),
                  );
                  console.log(
                    "🔐 [PinPad] PIN encryption completed successfully.",
                  );
                }, 500); // Wait 500ms after 4th key press
              }, 500); // Wait 500ms between 3rd and 4th press
            }, 500); // Wait 500ms between 2nd and 3rd press
          }, 500); // Wait 500ms between 1st and 2nd press
        }, 1000); // Initial wait
      }
      // ...existing code...

      // For commitTransaction method from BxDnsCommunication
      if (requestName === "CommitTransaction") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "DnsCommunication",
              Type: "CommitTransactionCompleted",
              Name: "CommitTransactionCompleted",
              Detail: "OK",
            }),
          );
          console.log(
            "✅ [DnsCommunication] Transaction committed successfully.",
          );
        }, 2000);
      }

      // For downloadConfig method (from PinPad) - This is for configuration
      if (requestName === "DownloadConfig") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "PinPad",
              Type: "InjectWorkingKeyCompleted",
              Name: "InjectWorkingKeyCompleted",
              Detail: "OK",
            }),
          );
          console.log(
            "🔑 [PinPad] Working key injected - Configuration downloaded successfully.",
          );
        }, 1000);
      }
      /** -------------------------------
       * TRANSACTION (NDC) — unchanged
       * ------------------------------- */
      if (requestName === "TransactionStart") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "TransactionStartResponse",
              Name: "TransactionStartResponse",
              Detail: "OK",
              TransactionType: "NDC",
              Device: "Transaction",
            }),
          );
        }, 1000);
      }

      if (requestName === "TransactionEnd") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "TransactionEndResponse",
              Name: "TransactionEndResponse",
              Detail: "OK",
              TransactionType: "NDC",
              ContinueTransaction: "False",
              Device: "Transaction",
            }),
          );
        }, 1000);
      }

      if (requestName === "SendNDCHostRequest") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "RecvFromNDCHostResponse",
              Name: "RecvFromNDCHostResponse",
              Detail: "OK",
              NextState: "DisplayScreen",
              FID: "100",
              IsRejected: false,
              DisplayMessage: "Welcome to ATM",
              ReceivedEventType: "DISPLAY",
              NeedICCReInit: "False",
              Device: "Transaction",
            }),
          );
        }, 1000);
      }

      if (requestName === "SendNDCCloseState") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "NDCCloseStateResponse",
              Name: "NDCCloseStateResponse",
              Detail: "OK",
              Device: "Transaction",
            }),
          );
        }, 1000);
      }
      /** ---------------------------------
       * RECEIPT PRINTER SIMULATION
       * --------------------------------- */
      if (requestName === "GetReceiptPrinterStatus") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ReceiptPrinterStatusResponse",
              Name: "ReceiptPrinterStatusResponse",
              Device: "ReceiptPrinter",
              DeviceStatus: "DEVONLINE",
              IsAvailable: true,
              PaperStatus: "FULL",
              TonerStatus: "FULL",
            }),
          );
        }, 1000);
      }

      if (
        requestName === "PrintWithEject" ||
        requestName === "PrintWithReceipt" ||
        requestName === "PrintReceiptWithEject"
      ) {
        // 1) Printer ready
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK",
              Device: "ReceiptPrinter",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 2000);

        // 2) A single 'print' completes (your client may send multiple prints; reply each time)
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CutCompleted",
              Name: "CutCompleted",
              Detail: "OK",
              ErrorCode: null,
              Device: "ReceiptPrinter",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 3000);

        // 3) Always send EjectMediaCompleted for frontend mock compatibility
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "EjectMediaCompleted",
              Name: "EjectMediaCompleted",
              Detail: "OK",
              ErrorCode: null,
              Device: "ReceiptPrinter",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 3500); // Added for frontend mock compatibility
        // If PrintReceiptWithEject, this will send twice, which is fine for mock
      }

      if (requestName === "Eject" || requestName === "EjectReceipt") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "EjectMediaCompleted",
              Name: "EjectMediaCompleted",
              Detail: "OK",
              ErrorCode: null,
              Device: "ReceiptPrinter",
            }),
          );
        }, 4000);
      }

      if (requestName === "Reset_ReceiptPrinter") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ResetDeviceCompleted",
              Name: "ResetDeviceCompleted",
              Detail: "OK",
              ErrorCode: null,
              Device: "ReceiptPrinter",
            }),
          );
        }, 5000);
      }

      /** -------------------------------
       * ADMIN LOGIN API TOKEN RESPONSE:
       * ------------------------------- */
      if (requestName === "GetAdminLoginApiToken") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "AdminLoginCompleted",
              Name: "AdminLoginCompleted",
              Detail: "OK",
              ErrorCode: "0000",
              ErrorTitle: null,
              ErrorDescription: null,
              Device: "ApiTokenManager",
              AccessToken:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_token...",
              TokenType: "Bearer",
              ExpiresIn: 7200,
              Scope: "admin",
            }),
          );
        }, 1000);
      }
      if (requestName === "ReadData") {
        count++;
        // Increment counter and determine parity
        // readDataCounter++;
        // const isEvenReadData = readDataCounter % 2 === 0;
        // const readDataDetail = isEvenReadData ? "ERROR" : "OK";

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "CommandReadyCompleted",
              Name: "CommandReadyCompleted",
              Detail: "OK", // This tells client scanner is ready
              ErrorCode: null,
              Device: "BarcodeScanner",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 1000);

        // if (count == 1) {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ReadDataCompleted",
              Name: "ReadDataCompleted",
              ReadData: "799366461560006371682882520102", // "799366572076058120078208303126", //"799366461560006371682882520102  \r", //AP26133159596930  AP26133109565596
              // ReadData: "AP26133159596930", //"799366572076058120077890789618     \r", //568060512166001572
              Detail: "OK",
              ErrorCode: null,
              Device: "BarcodeScanner",
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
            }),
          );
        }, 3000);
        // }
        // if (count == 2) {
        //   setTimeout(() => {
        //     ws.send(
        //       JSON.stringify({
        //         Type: "ReadDataCompleted",
        //         Name: "ReadDataCompleted",
        //         ReadData: "AP26056722299552\r",
        //         Detail: "OK",
        //         ErrorCode: null,
        //         Device: "BarcodeScanner",
        //         ErrorCode: "0000",
        //         ErrorTitle: "Success",
        //         ErrorDescription: "The operation completed successfully.",
        //       }),
        //     );
        //   }, 3000);
        // }
        // if (count == 3) {
        //   setTimeout(() => {
        //     ws.send(
        //       JSON.stringify({
        //         Type: "ReadDataCompleted",
        //         Name: "ReadDataCompleted",
        //         ReadData: "AP26056575862936\r",
        //         Detail: "OK",
        //         ErrorCode: null,
        //         Device: "BarcodeScanner",
        //         ErrorCode: "0000",
        //         ErrorTitle: "Success",
        //         ErrorDescription: "The operation completed successfully.",
        //       }),
        //     );
        //   }, 3000);
        // }
        // if (count == 4) {
        //   setTimeout(() => {
        //     ws.send(
        //       JSON.stringify({
        //         Type: "ReadDataCompleted",
        //         Name: "ReadDataCompleted",
        //         ReadData: "AP26056241701441\r",
        //         Detail: "OK",
        //         ErrorCode: null,
        //         Device: "BarcodeScanner",
        //         ErrorCode: "0000",
        //         ErrorTitle: "Success",
        //         ErrorDescription: "The operation completed successfully.",
        //       }),
        //     );
        //   }, 3000);
        // }
        // if (count == 5) {
        //   setTimeout(() => {
        //     ws.send(
        //       JSON.stringify({
        //         Type: "ReadDataCompleted",
        //         Name: "ReadDataCompleted",
        //         ReadData: "AP26050677874706\r",
        //         Detail: "OK",
        //         ErrorCode: null,
        //         Device: "BarcodeScanner",
        //         ErrorCode: "0000",
        //         ErrorTitle: "Success",
        //         ErrorDescription: "The operation completed successfully.",
        //       }),
        //     );
        //   }, 3000);
        // }
        // 2 second delay to simulate scanning time
      }

      // QrcodeValidation response
      if (requestName === "QrcodeValidation") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "GetDongleMetadataResponse",
              Name: "GetDongleMetadataResponse",
              Detail: "OK",
              ResponseCode: "00",
              ResponseMessage: "Success",
              ErrorCode: null,
              Device: "Pyramid",
            }),
          );
        }, 500);
      }

      // PyramidCodeValidation response
      if (requestName === "PyramidCodeValidation") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Name: "PyramidCodeValidationResponse",
              Type: "PyramidCodeValidationResponse",
              Detail: "OK",
              Message: "Validation successful",
              Code: "SUCCESS",
              Claim: "153",
              IsSuccess: true,
              DecryptedJson:
                '{"flags":"","hash":"21223221d71b85be19102727718f22b5be821e986b9bf88c871ad6bb8b1c8d1727d30df"}',
              Device: "Pyramid",
            }),
          );
        }, 500);
      }
      // Inputdata response for PinPad
      if (requestName === "Inputdata" || requestName === "InputData") {
        const keyPresses = ["KEY_2"];

        // Use a counter to cycle through the array
        if (!inputDataCounter) inputDataCounter = 0;
        const currentKey = keyPresses[inputDataCounter % keyPresses.length];
        inputDataCounter++;

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "PinPad",
              ResponseData: {
                PressedKey: currentKey,
                InputData: null,
                Name: "KeyPressed",
                Type: "KeyPressed",
                Detail: "OK",
              },
            }),
          );
        }, 5000);
      }

      // // Inputdata response for PinPad
      // if (requestName === "Inputdata" || requestName === "InputData") {
      //   /
      // / KEY_1
      //   setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "PinPad",
      //         ResponseData: {
      //           PressedKey: "KEY_1",
      //           InputData: "*",
      //           Name: "KeyPressed",
      //           Type: "KeyPressed",
      //           Detail: "OK",
      //         },
      //       })
      //     );
      //     console.log("🔢 [PinPad] KEY_1 pressed");
      //   }, 1000);

      //   // KEY_2
      //   setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "PinPad",
      //         ResponseData: {
      //           PressedKey: "KEY_2",
      //           InputData: "*",
      //           Name: "KeyPressed",
      //           Type: "KeyPressed",
      //           Detail: "OK",
      //         },
      //       })
      //     );
      //     console.log("🔢 [PinPad] KEY_2 pressed");
      //   }, 2000);

      //   // KEY_4
      //   setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "PinPad",
      //         ResponseData: {
      //           PressedKey: "KEY_4",
      //           InputData: "*",
      //           Name: "KeyPressed",
      //           Type: "KeyPressed",
      //           Detail: "OK",
      //         },
      //       })
      //     );
      //     console.log("🔢 [PinPad] KEY_4 pressed");
      //   }, 3500);
      //     setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "PinPad",
      //         ResponseData: {
      //           PressedKey: "KEY_5",
      //           InputData: "*",
      //           Name: "KeyPressed",
      //           Type: "KeyPressed",
      //           Detail: "OK",
      //         },
      //       })
      //     );
      //     console.log("🔢 [PinPad] KEY_4 pressed");
      //     }, 3500);
      //     setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "PinPad",
      //         ResponseData: {
      //           PressedKey: "KEY_6",
      //           InputData: "*",
      //           Name: "KeyPressed",
      //           Type: "KeyPressed",
      //           Detail: "OK",
      //         },
      //       })
      //     );
      //     console.log("🔢 [PinPad] KEY_4 pressed");
      //     }, 3500);
      //     setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "PinPad",
      //         ResponseData: {
      //           PressedKey: "KEY_9",
      //           InputData: "*",
      //           Name: "KeyPressed",
      //           Type: "KeyPressed",
      //           Detail: "OK",
      //         },
      //       })
      //     );
      //     console.log("🔢 [PinPad] KEY_4 pressed");
      //   }, 3500);

      //        setTimeout(() => {
      //     ws.send(
      //       JSON.stringify({
      //         Device: "PinPad",
      //         ResponseData: {
      //           PressedKey: "KEY_ENTER",
      //           InputData: null,
      //           Name: "KeyPressed",
      //           Type: "KeyPressed",
      //           Detail: "OK",
      //         },
      //       })
      //     );
      //   }, 5000);
      // }

      // SetModeResponse for KioskCore
      if (requestName === "SetATMMode") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "KioskCore",
              ResponseData: {
                Active: true,
                Name: "SetModeResponse",
                Type: "SetModeResponse",
                Detail: null,
              },
            }),
          );
        }, 500);
        // setTimeout(() => {
        //   ws.send(
        //     JSON.stringify({
        //       Device: "KioskCore",
        //       ResponseData: {
        //         Active: false,
        //         Name: "SetModeResponse",
        //         Type: "SetModeResponse",
        //         Detail: null,
        //       },
        //     })
        //   );
        // }, 1000);
      }

      if (requestName === "GetCassetteTotal") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "CashManage",
              ResponseData: {
                Cassettestotal:
                  "        ***   CASSETTE TOTAL   ***\r\n       Start : 01/01/2005,01:01:00\r\n       Today : 12/25/2025 10:55:56\r\n           Terminal#: DNSFFFB2\r\n\r\nCST1Loaded         : 50($2000)\r\n        Dispensed  : 0\r\n        Rejected   : 0\r\n        Tested     : 3\r\n        Remaining  : 47($94000)\r\n\r\nCST2Loaded         : 50($500)\r\n        Dispensed  : 0\r\n        Rejected   : 3\r\n        Tested     : 3\r\n        Remaining  : 44($22000)\r\n\r\n",
                ErrorCode: "000",
                Name: "GetCassetteTotalResponse",
                Type: "GetCassetteTotalResponse",
                Detail: "OK",
              },
            }),
          );
        }, 500);
      }

      if (requestName === "ClearCassetteTotal") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "CashManage",
              ResponseData: {
                ErrorCode: null,
                Name: "ClearCassetteTotalResponse",
                Type: "ClearCassetteTotalResponse",
                Detail: "OK",
              },
            }),
          );
        }, 500);
      }

      if (requestName === "GetDayTotal") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "CashManage",
              ResponseData: {
                Cassettestotal:
                  "        ***   CASSETTE TOTAL   ***\r\n       Start : 01/01/2005,01:01:00\r\n       Today : 12/25/2025 10:55:56\r\n           Terminal#: DNSFFFB2\r\n\r\nCST1Loaded         : 50($2000)\r\n        Dispensed  : 0\r\n        Rejected   : 0\r\n        Tested     : 3\r\n        Remaining  : 47($94000)\r\n\r\nCST2Loaded         : 50($500)\r\n        Dispensed  : 0\r\n        Rejected   : 3\r\n        Tested     : 3\r\n        Remaining  : 44($22000)\r\n\r\n",
                ErrorCode: "000",
                Name: "GetDayTotalResponse",
                Type: "GetDayTotalResponse",
                Detail: "OK",
              },
            }),
          );
        }, 500);
      }

      if (requestName === "ClearDayTotal") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Device: "CashManage",
              ResponseData: {
                ErrorCode: null,
                Name: "ClearDayTotalResponse",
                Type: "ClearDayTotalResponse",
                Detail: "OK",
              },
            }),
          );
        }, 500);
      }

      if (requestName === "GetApiToken") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "GetApiTokenCompleted",
              Name: "GetApiTokenCompleted",
              Detail: "OK",
              ErrorCode: null,
              Device: "ApiTokenManager",
              AccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              TokenType: "Bearer",
              ExpiresIn: 3600,
              Scope: "admin",
            }),
          );
        }, 1000);
      }

      if (requestName === "GetJournal") {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "GetJournalCompleted",
              Name: "GetJournalCompleted",
              Detail: "OK",
              Data: {
                totalCount: 11,
                result: [
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0087",
                    journalName: "Event Journal",
                    journalType: 1,
                    createdTime: "2026-01-16T18:06:22",
                    status: "WARNING",
                    description: "Low cash alert triggered for cassette 1",
                    displayData:
                      "DEVICE STATUS CHANGE; CASH DISPENSER; LOW CASH ALERT",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0088",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:07:45",
                    status: "SUCCESS",
                    description: "Balance inquiry completed",
                    displayData:
                      "BALANCE INQUIRY; ACCOUNT FROM CHECKING; BALANCE ₹2,450.50;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0089",
                    journalName: "Event Journal",
                    journalType: 1,
                    createdTime: "2026-01-16T18:08:10",
                    status: "INFO",
                    description: "Receipt printer paper level low",
                    displayData:
                      "DEVICE MAINTENANCE; RECEIPT PRINTER; PAPER LOW",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                  {
                    terminalId: "ATM-DEL-001",
                    sequenceNumber: "0086",
                    journalName: "Transaction Journal",
                    journalType: 0,
                    createdTime: "2026-01-16T18:05:16",
                    status: "SUCCESS",
                    description: "Cash withdrawal completed successfully",
                    displayData:
                      "NORMAL TRANSACTION; *WITHDRAWAL*; ACCOUNT FROM SAVINGS; REQUESTED ₹500.00;",
                  },
                ],
              },
              ErrorCode: "0000",
              ErrorTitle: "Success",
              ErrorDescription: "The operation completed successfully.",
              Device: "Journal",
            }),
          );
        }, 2000);
      }
    } catch (err) {
      console.error(`❗ JSON parsing error from client #${ws.id}:`, err);
      ws.send(
        JSON.stringify({
          Name: "Error",
          Payload: "Invalid JSON format",
          Device: "Unknown",
        }),
      );
    }
  });

  ws.on("close", () => {
    console.log(`❌ Client #${ws.id} disconnected`);
  });
});

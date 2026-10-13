const WebSocket = require("ws");
const PORT = 9091;
let clientIdCounter = 0;

// Define ServiceState to match the frontend package exactly
const ServiceState = {
  OFFLINE: "OFFLINE",
  /**
   * The ATM is in service and transactions are available (at least one transaction type)
   */
  INSERVICE: "INSERVICE",
  /**
   * The ATM is in supervisor mode - no transactions available
   */
  INSUPERVISOR: "INSUPERVISOR",
  Maintenance: "Maintenance",
  /**
   * The ATM is out of service - hardware error possible
   */
  OUTOFSERVICE: "OUTOFSERVICE",
  /**
   * Initial service state
   */
  PENDING: "PENDING",
  /**
   * Power up state - preparing devices
   */
  POWERUP: "POWERUP",
};

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
});

wss.on("connection", (ws) => {
  ws.id = ++clientIdCounter;
  console.log(`🔌 Client #${ws.id} connected`);

  // Send initial terminal mode on connection
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "ModeResponse",
        Name: "ModeResponse",
        Detail: "OK",
        Status: "IN_SERVICE",
        Device: "KioskCore",
      })
    );
    console.log("📡 Initial terminal mode sent");
  }, 1000);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const header = data.Header || data.Name;
      const parsedPayload = JSON.parse(data.Payload || "{}");
      const requestName = parsedPayload.Name;

      // Log incoming message details
      console.log(`📩 Client #${ws.id} - FULL MESSAGE DETAILS:`);
      console.log("=".repeat(60));
      console.log("Raw Message:", message.toString());

      // Log full parsed data structure
      const fullData = {
        Name: data.Name || "N/A",
        Tag: data.Tag || "N/A",
        Header: header,
        Device: data.Device || "N/A",
        IsEncrypt: data.IsEncrypt,
        Token: data.Token,
        Payload: {
          Name: parsedPayload.Name,
          Tag: parsedPayload.Tag,
          DataParameter: parsedPayload.DataParameter,
          timestamp: parsedPayload.timestamp,
          uuid: parsedPayload.uuid,
        },
      };

      console.log("Parsed Data:", JSON.stringify(fullData, null, 2));
      console.log("Request Type:", requestName);
      console.log("=".repeat(60));

      // Handle different request types
      switch (requestName) {
        case "InitMode":
          handleInitMode(ws);
          break;
        case "GetMode":
          handleGetMode(ws);
          break;
        case "CancelAccept":
          handleCancelAccept(ws);
          break;
        case "AcceptNote":
          handleAcceptNote(ws);
          break;
        case "CommitNote":
          handleCommitNote(ws);
          break;
        case "GetCashAcceptorStatus":
          handleGetCashAcceptorStatus(ws);
          break;
        case "DispenseByAmount":
        case "DispenseByCount":
          handleDispense(ws);
          break;
        case "RetractNote":
          handleRetractNote(ws);
          break;
        case "TransactionStart":
          handleTransactionStart(ws);
          break;
        case "TransactionEnd":
          handleTransactionEnd(ws);
          break;
        case "SendNDCHostRequest":
          handleNDCHostRequest(ws);
          break;
        case "SendNDCCloseState":
          handleNDCCloseState(ws);
          break;
        case "GetReceiptPrinterStatus":
          handleGetReceiptPrinterStatus(ws);
          break;
        case "PrintReceipt":
        case "PrintReceiptWithEject":
          handlePrintReceipt(ws);
          break;
        case "Eject":
        case "EjectReceipt":
          handleEjectReceipt(ws);
          break;
        case "Reset_ReceiptPrinter":
          handleResetPrinter(ws);
          break;
        case "ReadData":
          handleReadData(ws);
          break;
        default:
          console.log(`⚠️ Unhandled request type: ${requestName}`);
      }
    } catch (err) {
      console.error(`❗ Error processing message from client #${ws.id}:`, err);
      ws.send(
        JSON.stringify({
          Name: "Error",
          Detail: "Invalid message format",
          Device: "Unknown",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log(`❌ Client #${ws.id} disconnected`);
  });
});

// Handler functions
function handleInitMode(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "InitModeResponse",
        Name: "InitModeResponse",
        Detail: "OK",
        status: "IN_SERVICE", // Using the exact enum value
        Device: "KioskCore",
      })
    );
    console.log("✅ [Terminal] Init mode response sent");
  }, 1000);
}

function handleGetMode(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "ModeResponse",
        Name: "ModeResponse",
        Detail: "OK",
        status: "IN_SERVIC", // Using the exact enum value
        Device: "KioskCore",
      })
    );
  }, 1000);
}

function handleCancelAccept(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "AcceptNoteCompleted",
        Name: "AcceptNoteCompleted",
        Detail: "CANCELLED",
        CashInStatus: "",
        StackerStatus: "NOT_EMPTY",
        LastRefusedCount: null,
        PositionStatus: "EMPTY",
        ErrorCode: "0000000",
        Device: "CashAcceptor",
      })
    );
  }, 1000);
}

function handleAcceptNote(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "CommandReadyCompleted",
        Name: "CommandReadyCompleted",
        Detail: "OK",
        Device: "CashAcceptor",
      })
    );
  }, 3000);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "ItemsInserted",
        Name: "ItemsInserted",
        Detail: "OK",
        Device: "CashAcceptor",
      })
    );
  }, 10000);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "TaskCompleted",
        Name: "TaskCompleted",
        Detail: "SHUTTER_CLOSE",
        Device: "CashAcceptor",
      })
    );
  }, 6000);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "AcceptNoteCompleted",
        Name: "AcceptNoteCompleted",
        Detail: "OK",
        CashInStatus: "50~1",
        StackerStatus: "NOTEMPTY",
        LastRefusedCount: "0",
        PositionStatus: "EMPTY",
        Device: "CashAcceptor",
      })
    );
  }, 12000);
}

function handleCommitNote(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "CommandReadyCompleted",
        Name: "CommandReadyCompleted",
        Detail: "OK",
        Device: "CashAcceptor",
      })
    );
  }, 6000);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "CommitNoteCompleted",
        Name: "CommitNoteCompleted",
        Detail: "OK",
        ErrorCode: null,
        Device: "CashAcceptor",
      })
    );
  }, 4000);
}

function handleGetCashAcceptorStatus(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "CashAcceptorStatusResponse",
        Name: "CashAcceptorStatusResponse",
        Detail: "OK",
        PositionStatus: "EMPTY",
        StackerStatus: "NOTEMPTY",
        Device: "CashAcceptor",
      })
    );
  }, 300);
}

function handleDispense(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "CommandReadyCompleted",
        Name: "CommandReadyCompleted",
        Detail: "OK",
        Device: "CashDispenser",
      })
    );
    console.log("✅ [Dispenser] Command ready completed successfully.");

    setTimeout(() => {
      ws.send(
        JSON.stringify({
          Type: "DispenseNoteCompleted",
          Name: "DispenseNoteCompleted",
          Detail: "OK",
          ErrorCode: null,
          Device: "CashDispenser",
        })
      );
      console.log("💸 [Dispenser] Dispensing cash...");

      setTimeout(() => {
        ws.send(
          JSON.stringify({
            Type: "ItemsPresented",
            Name: "ItemsPresented",
            Detail: "OK",
            Device: "CashDispenser",
          })
        );
        console.log("📤 [Dispenser] Items presented successfully.");

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              Type: "ItemsTaken",
              Name: "ItemsTaken",
              Detail: "OK",
              Device: "CashDispenser",
            })
          );
          console.log("🤝 [Dispenser] Customer took the cash.");
        }, 2000);
      }, 2000);
    }, 3000);
  }, 2000);
}

function handleRetractNote(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "RetractNoteCompleted",
        Name: "RetractNoteCompleted",
        Detail: "OK",
        ErrorCode: null,
        Device: "CashDispenser",
      })
    );
  }, 1000);
}

function handleTransactionStart(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "TransactionStartResponse",
        Name: "TransactionStartResponse",
        Detail: "OK",
        TransactionType: "yyyy",
        Device: "Transaction",
      })
    );
  }, 1000);
}

function handleTransactionEnd(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "TransactionEndResponse",
        Name: "TransactionEndResponse",
        Detail: "OK",
        TransactionType: "NDC",
        ContinueTransaction: "False",
        Device: "Transaction",
      })
    );
  }, 1000);
}

function handleNDCHostRequest(ws) {
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
      })
    );
  }, 1000);
}

function handleNDCCloseState(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "NDCCloseStateResponse",
        Name: "NDCCloseStateResponse",
        Detail: "OK",
        Device: "Transaction",
      })
    );
  }, 1000);
}

function handleGetReceiptPrinterStatus(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "ReceiptPrinterStatusResponse",
        Name: "ReceiptPrinterStatusResponse",
        Device: "ReceiptPrinter",
        DeviceStatus: "DEVONLINE",
        IsAvailable: "True",
        PaperStatus: "FULL",
        TonerStatus: "FULL",
      })
    );
  }, 1000);
}

function handlePrintReceipt(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "CommandReadyCompleted",
        Name: "CommandReadyCompleted",
        Detail: "OK",
        Device: "ReceiptPrinter",
      })
    );
  }, 2000);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "PrintCompleted",
        Name: "PrintCompleted",
        Detail: "OK",
        ErrorCode: null,
        Device: "ReceiptPrinter",
      })
    );
  }, 4000);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "EjectMediaCompleted",
        Name: "EjectMediaCompleted",
        Detail: "OK",
        ErrorCode: null,
        Device: "ReceiptPrinter",
      })
    );
  }, 4500);
}

function handleEjectReceipt(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "EjectMediaCompleted",
        Name: "EjectMediaCompleted",
        Detail: "OK",
        ErrorCode: null,
        Device: "ReceiptPrinter",
      })
    );
  }, 4000);
}

function handleResetPrinter(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "ResetDeviceCompleted",
        Name: "ResetDeviceCompleted",
        Detail: "OK",
        ErrorCode: null,
        Device: "ReceiptPrinter",
      })
    );
  }, 5000);
}

function handleReadData(ws) {
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "CommandReadyCompleted",
        Name: "CommandReadyCompleted",
        Detail: "OK",
        ErrorCode: null,
        Device: "BarcodeReader",
      })
    );
  }, 1000);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        Type: "ReadDataCompleted",
        Name: "ReadDataCompleted",
        ReadData: "123456789012345",
        Detail: "OK",
        ErrorCode: null,
        Device: "BarcodeReader",
      })
    );
  }, 10000);
}
